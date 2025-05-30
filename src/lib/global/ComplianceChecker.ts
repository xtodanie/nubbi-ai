'use server';

import { OpenAI } from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const ComplianceCheckInputSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  industry: z.string().min(1, 'Industry is required'),
  language: z.string().min(1, 'Language is required'),
});

export type ComplianceCheckInput = z.infer<typeof ComplianceCheckInputSchema>;

export const ComplianceCheckOutputSchema = z.object({
  country: z.string(),
  industry: z.string(),
  mandatoryModules: z.array(z.object({
    title: z.string(),
    legalBasis: z.string(),
    mandatory: z.boolean(),
    recommendedDelivery: z.enum(['video', 'article', 'interactive', 'quiz', 'blended']),
  })),
});

export type ComplianceCheckOutput = z.infer<typeof ComplianceCheckOutputSchema>;

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

export async function runComplianceChecker(input: ComplianceCheckInput): Promise<ComplianceCheckOutput> {
  try {
    ComplianceCheckInputSchema.parse(input);

    const { country, industry, language } = input;

    const systemPrompt = `
You are a legal and compliance onboarding expert specialized in international HR.
Your task is to generate a structured list of mandatory compliance training modules required by law, regulation, or industry standards
for onboarding in the "${industry}" sector, operating in "${country}".

Output Format:
- JSON object with:
  - country
  - industry
  - mandatoryModules: array of objects with:
    - title: clear module title
    - legalBasis: specific law, directive, or policy name
    - mandatory: true or false (based on regulation)
    - recommendedDelivery: one of [video, article, interactive, quiz, blended]

Constraints:
- Return between 3 and 10 modules
- Tailor results to national and industry norms (e.g. GDPR, OSHA, HIPAA, NOM-035, ISO, sector-specific rules)
- No soft skills, no placeholders
- Language: ${language}
- Output: ONLY valid JSON inside \u0060\u0060\u0060json block (no markdown or explanations)
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.4,
      max_tokens: 2048,
    });

    const resultText = response.choices[0]?.message?.content || '';

    if (!resultText || resultText.length < 200) {
      throw new Error('⚠️ AI output too short or invalid.');
    }

    const parsedJson = extractJsonFromString(resultText);

    if (!parsedJson) {
      console.error('Failed to extract JSON. Raw output:', resultText);
      throw new Error('❌ Could not extract or parse JSON from AI response.');
    }

    const validated = ComplianceCheckOutputSchema.parse(parsedJson);
    console.log('✅ Compliance modules generated successfully.');
    return validated;
  } catch (error: any) {
    console.error('Error running compliance checker:', error);
    throw new Error(`Failed to generate compliance data: ${error.message}`);
  }
}