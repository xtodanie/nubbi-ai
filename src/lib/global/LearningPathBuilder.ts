'use server';

import { OpenAI } from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const LearningPathInputSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  experienceLevel: z.enum(['entry', 'intermediate', 'advanced']),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  digitalMaturity: z.enum(['low', 'medium', 'high']),
  preferredLanguage: z.string().min(1, 'Preferred language is required'),
});

export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

export const LearningPathOutputSchema = z.object({
  role: z.string(),
  pathTitle: z.string(),
  overview: z.string(),
  totalDurationDays: z.number().int().positive(),
  stages: z.array(z.object({
    id: z.string(),
    stageTitle: z.string(),
    goal: z.string(),
    modules: z.array(z.object({
      id: z.string(),
      title: z.string(),
      format: z.enum(['video', 'article', 'interactive', 'quiz', 'blended']),
      durationMinutes: z.number().int().positive(),
      objectives: z.array(z.string()),
      recommendedTools: z.array(z.string()).optional(),
    })),
  })),
});

export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

function extractJsonFromString(text: string): any | null {
  try {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(regex);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error('Failed to extract or parse JSON:', error);
    return null;
  }
}

export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  try {
    LearningPathInputSchema.parse(input);

    const { role, experienceLevel, industry, country, digitalMaturity, preferredLanguage } = input;

    const systemPrompt = `
You are a world-class AI curriculum designer specialized in corporate onboarding and adaptive learning strategies.

Design a fully structured, end-to-end onboarding learning path for a new employee in the role of "${role}" at the ${experienceLevel} level, in the "${industry}" industry, working in "${country}". The company’s digital maturity is "${digitalMaturity}". Output must be in ${preferredLanguage}.

=== STRUCTURE ===
1. Path Title
2. Executive Overview (100–150 words)
3. Total Estimated Duration (in days)
4. 3–5 Learning Stages, each with:
   - Stage ID (e.g. stage-01)
   - Stage Title
   - Stage Goal (what the employee should achieve by the end)
   - 2–4 Modules per stage:
     - Module ID (e.g. mod-01-01)
     - Module Title
     - Description (minimum 120 words)
     - Format: one of [video, article, interactive, quiz, blended]
     - Estimated duration in minutes
     - 3–5 Learning Objectives
     - Recommended Tools or Resources (optional)

=== RULES ===
- No placeholders or vague text.
- Customize complexity based on experienceLevel and digitalMaturity.
- Reflect local business practices and work culture of ${country}.
- Write in natural, instructional tone suitable for ${preferredLanguage}.
- Return output as a single valid JSON inside a code block like this: \u0060\u0060\u0060json ... \u0060\u0060\u0060
- JSON must match the output schema perfectly. No extra text or markdown.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.6,
      max_tokens: 4096,
    });

    const resultText = response.choices[0]?.message?.content || '';

    if (!resultText || resultText.length < 300) {
      throw new Error('⚠️ AI output too short or invalid. Prompt may need adjustment or model returned minimal content.');
    }

    const parsedJson = extractJsonFromString(resultText);

    if (!parsedJson) {
      console.error('Failed to extract and parse JSON from AI response. Raw output:', resultText);
      throw new Error('❌ Failed to parse JSON output from AI.');
    }

    const validatedOutput = LearningPathOutputSchema.parse(parsedJson);
    console.log('✅ Successfully generated learning path.');
    return validatedOutput;
  } catch (error: any) {
    console.error('Error generating learning path:', error);
    throw new Error(`Failed to generate learning path: ${error.message}`);
  }
}
