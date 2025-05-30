'use server';

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Initialize Anthropic client - Ensure ANTHROPIC_API_KEY is set in your environment
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Define the input schema for the onboarding generator
export const GlobalOnboardingInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  digitalMaturity: z.enum(['low', 'medium', 'high']),
  employeeProfile: z.object({
    role: z.string().min(1, "Employee role is required"),
    experienceLevel: z.enum(['entry', 'intermediate', 'advanced']),
    workEnvironment: z.enum(['remote', 'on-site', 'hybrid']),
  }),
});

export type GlobalOnboardingInput = z.infer<typeof GlobalOnboardingInputSchema>;

// Define the output schema based on the desired JSON structure
export const GlobalOnboardingOutputSchema = z.object({
  programTitle: z.string(),
  description: z.string(),
  estimatedDurationDays: z.number().int().positive(),
  modules: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    learningOutcomes: z.array(z.string()),
    format: z.enum(["video", "article", "interactive", "quiz", "blended"]),
    durationMinutes: z.number().int().positive(),
    activities: z.array(z.string()),
    evaluation: z.object({
      type: z.enum(["quiz", "assignment", "simulation"]),
      questions: z.array(z.object({
        question: z.string(),
        options: z.array(z.string()).min(2, "At least two options are required"),
        correctAnswer: z.string(),
      })),
    }),
    videoScript: z.string().optional(),
    visualSceneInstructions: z.string().optional(),
  })),
  legalCompliance: z.array(z.string()).optional(),
  requiredIntegrations: z.array(z.string()).optional(),
});

export type GlobalOnboardingOutput = z.infer<typeof GlobalOnboardingOutputSchema>;

// Helper function to extract JSON from a string that may contain Markdown
function extractJsonFromString(text: string): any | null {
  try {
    // Attempt to find a JSON block indicated by ```json ... ```
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(regex);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }

    // If no specific JSON block found, try to parse the whole string if it looks like JSON
    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
      return JSON.parse(text);
    }

    return null;
  } catch (error) {
    console.error("Failed to extract or parse JSON:", error);
    return null;
  }
}

// Main function to generate the enterprise onboarding curriculum
export async function generateEnterpriseOnboarding(input: GlobalOnboardingInput): Promise<GlobalOnboardingOutput> {
  try {
    GlobalOnboardingInputSchema.parse(input);

    const { companyName, industry, country, preferredLanguage, digitalMaturity, employeeProfile } = input;

    // Construct the system prompt for the AI
    // This will be used in the 'system' parameter for Anthropic
    const systemPrompt = `
You are an enterprise-grade AI onboarding system architect. You design high-performance, multi-country, zero-human-intervention onboarding programs for real companies across industries.

Your task is to generate a **complete, end-to-end onboarding curriculum** for a company named "${companyName}" in the "${industry}" sector, operating in "${country}". Their digital maturity is "${digitalMaturity}" and the onboarding is for new employees in the role of "${employeeProfile.role}" (experience level: ${employeeProfile.experienceLevel}) working in a "${employeeProfile.workEnvironment}" environment. The final output must be written in ${preferredLanguage}.

Requirements:

=== 1. CORE STRUCTURE ===
- Onboarding Program Title
- Description of the whole program
- Total estimated time (in days and hours)
- Key learning goals and behavioral expectations
- Format distribution: % video, % reading, % simulation, % live (if any)
- Local compliance & regulation modules (adapted to ${country})
- Health and safety protocols (country-specific)
- Security policies (IT access, physical access, data privacy)

=== 2. MODULES (8–12 RELEVANT MODULES) ===
For each module:
- Module ID (unique identifier, e.g., "mod-01")
- Title
- Learning outcomes (at least 3 specific outcomes)
- Detailed description (min 150 words, explaining the module's content and importance)
- Recommended delivery format (choose ONE: video, article, interactive, quiz, blended)
- Estimated time to complete (in minutes, realistic estimate)
- Activities/tasks (practical exercises or reflective questions)
- Evaluation method (choose ONE: quiz, assignment, simulation)
- Voice narration script for AI avatars (if video format is suggested)
- Visual scene suggestions for video generation (detailed descriptions for each scene)
- 3 quiz questions (multiple choice) with exactly 4 options and the correct answer clearly marked.

=== 3. GLOBAL LOCALIZATION LAYER ===
- Adjust tone and content for local work culture in ${country}.
- Include legal onboarding requirements specific to ${industry} in ${country}.
- Add modules if the country requires specific mandatory training (e.g., GDPR in EU, OSHA in US, specific industry certifications).
- If ${digitalMaturity} is “low”, simplify technical interfaces descriptions, and suggest including print/pdf variants of materials.

=== 4. TECHNICAL METADATA & DEPLOYMENT JSON ===
Return a JSON structure following the provided schema. Ensure all fields are populated with generated content, not placeholders.

=== RULES ===
- DO NOT generate vague or placeholder content.
- All text must be fully fleshed out — no templates, no mockups.
- Assume the output will be parsed and used by real SaaS onboarding software.
- Must be executable without manual editing.
- Think like a compliance officer, onboarding manager, trainer, and L&D strategist — all in one.
- PROVIDE THE FULL JSON OUTPUT WITHIN A \`\`\`json BLOCK AT THE END OF YOUR RESPONSE.
- Ensure the JSON is valid and matches the specified schema precisely.
- The language of the output content must be ${preferredLanguage}.
`;

    // Call the Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229', // Using Claude Sonnet
      system: systemPrompt, // System instructions go here
      messages: [
        // Add a user message to initiate the conversation, as required by Anthropic
        { role: 'user', content: 'Generate the onboarding curriculum based on the provided system instructions and input parameters.' }
      ],
      temperature: 0.55,
      max_tokens: 4096, // Keep max tokens, adjust if needed for Claude's limits
    });

    // Access content from Anthropic's response format
    // Anthropic returns content as an array of text/tool_use/etc blocks
    const resultText = response.content.find(block => block.type === 'text')?.text || '';

    if (!resultText || resultText.length < 500) {
      throw new Error('⚠️ AI output too short or invalid. Prompt may need adjustment or model returned minimal content.');
    }

    const parsedJson = extractJsonFromString(resultText);

    if (!parsedJson) {
      console.error("Failed to extract and parse JSON from AI response. Raw output:", resultText);
      throw new Error('❌ Failed to parse JSON output from AI.');
    }

    // Validate the parsed JSON against the output schema
    const validatedOutput = GlobalOnboardingOutputSchema.parse(parsedJson);

    console.log("Successfully generated and validated onboarding curriculum.");
    return validatedOutput; // Return the validated structured data

  } catch (error: any) {
    console.error("Error generating enterprise onboarding:", error);
    // Re-throw the error after logging for the API handler to catch
    throw new Error(`Failed to generate onboarding curriculum: ${error.message}`);
  }
}
