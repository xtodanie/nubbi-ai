'use server';

/**
 * @fileOverview AI onboarding video script & storyboard generator, fully branded and custom.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const VideoScriptInputSchema = z.object({
  docContent: z.string().describe("Texto del documento/manual/policy"),
  companyName: z.string(),
  businessType: z.string(),
  brandColors: z.array(z.string()).optional(),
  tone: z.string().optional(), // Ej: "friendly", "corporate", "innovative"
  includeRealExamples: z.boolean().default(false),
  extraInstructions: z.string().optional(),
});
export type VideoScriptInput = z.infer<typeof VideoScriptInputSchema>;

const VideoScriptOutputSchema = z.object({
  storyboard: z.array(z.object({
    scene: z.string(),
    visualDescription: z.string(),
    narration: z.string(),
    keyColors: z.array(z.string()).optional(),
    durationSec: z.number().optional(),
  })),
  fullScript: z.string(),
  styleNotes: z.string(),
  recommendedAItools: z.string(),
});
export type VideoScriptOutput = z.infer<typeof VideoScriptOutputSchema>;

export async function aiOnboardingVideoScript(input: VideoScriptInput): Promise<VideoScriptOutput> {
  VideoScriptInputSchema.parse(input);

  const prompt = `
You are a professional onboarding video scriptwriter, specialized in AI-generated corporate videos.
Your job: Convert onboarding documentation into a clear, engaging, brand-matching video script and storyboard.
You must:

1. Use the company's brand identity (business type: ${input.businessType}, name: ${input.companyName}${input.brandColors?.length ? ', colors: ' + input.brandColors.join(', ') : ''}${input.tone ? ', tone: ' + input.tone : ''}).
2. If "includeRealExamples" is true, use concrete, realistic examples and common situations.
3. Respect these extra instructions: ${input.extraInstructions ?? "none"}.

Script for: "${input.companyName}" (${input.businessType})

DOCUMENT:
${input.docContent}

OUTPUT STRICTLY IN THIS JSON:
{
  "storyboard": [
    {
      "scene": "string (title or brief)",
      "visualDescription": "string (what is on screen: actors, animation, background, etc)",
      "narration": "string (spoken text for this scene, must be natural and clear)",
      "keyColors": ["..."], // optional: main colors to use for this scene
      "durationSec": number // (optional, recommended length in seconds)
    }
  ],
  "fullScript": "string (all narration, scene by scene)",
  "styleNotes": "string (advice for animators/video creators: animation type, transitions, voice, rhythm, fonts, etc)",
  "recommendedAItools": "Suggest 2-3 AI video tools that can create this video based on the script, and explain why"
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Expert AI onboarding video script & storyboard generator, always brand-aware." },
      { role: "user", content: prompt }
    ],
    temperature: 0.25,
  });

  const outputText = completion.choices[0].message.content || "";
  let parsed: any = {};
  const match = outputText.match(/({[\s\S]+})/);
  try { if (match) parsed = JSON.parse(match[1]); } catch (e) {
    parsed = {
      storyboard: [],
      fullScript: "",
      styleNotes: "Parsing error.",
      recommendedAItools: "Parsing error.",
    };
  }
  return VideoScriptOutputSchema.parse(parsed);
}
