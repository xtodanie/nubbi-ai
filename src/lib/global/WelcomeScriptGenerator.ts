'use server';

import { OpenAI } from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const WelcomeScriptInputSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  country: z.string().min(1, 'Country is required'),
  preferredLanguage: z.string().min(1, 'Language is required'),
  industry: z.string().optional(),
  tone: z.enum(['formal', 'friendly', 'inspirational']).optional().default('friendly'),
});

export type WelcomeScriptInput = z.infer<typeof WelcomeScriptInputSchema>;

export const WelcomeScriptOutputSchema = z.object({
  language: z.string(),
  role: z.string(),
  country: z.string(),
  tone: z.string(),
  script: z.string().min(100, 'Script must be meaningful'),
});

export type WelcomeScriptOutput = z.infer<typeof WelcomeScriptOutputSchema>;

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

export async function generateWelcomeScript(input: WelcomeScriptInput): Promise<WelcomeScriptOutput> {
  try {
    WelcomeScriptInputSchema.parse(input);

    const { role, country, preferredLanguage, industry, tone } = input;

    const systemPrompt = `
You are a world-class onboarding communications specialist. Your job is to craft the most engaging, authentic and emotionally resonant welcome script for a new employee joining a company in the role of "${role}" in "${country}".

Language: ${preferredLanguage}
Tone: ${tone}
Industry: ${industry || 'general'}

Script must:
- Be written in natural, human-like tone (not robotic)
- Include welcome, mission/vision of the company, cultural context
- Reference the employee's role and how it contributes to the company
- Set expectations for the first week
- Be emotionally intelligent and globally inclusive
- Be 100–300 words long
- Be usable as voice narration or first onboarding screen
- Signed optionally as: “From the People Team” or “CEO” depending on tone

Only return a JSON object like this inside a \u0060\u0060\u0060json block:
{
  "language": "...",
  "role": "...",
  "country": "...",
  "tone": "...",
  "script": "..."
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.65,
      max_tokens: 2048,
    });

    const resultText = response.choices[0]?.message?.content || '';

    if (!resultText || resultText.length < 200) {
      throw new Error('⚠️ Script too short or invalid.');
    }

    const parsedJson = extractJsonFromString(resultText);

    if (!parsedJson) {
      console.error('Failed to extract JSON. Raw output:', resultText);
      throw new Error('❌ Failed to parse script output from AI.');
    }

    const validated = WelcomeScriptOutputSchema.parse(parsedJson);
    console.log('✅ Welcome script generated.');
    return validated;
  } catch (error: any) {
    console.error('Error generating welcome script:', error);
    throw new Error(`Failed to generate welcome script: ${error.message}`);
  }
}
