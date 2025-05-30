'use server';

/**
 * @fileOverview AI Buddy Matching PRO
 * - aiBuddyMatchingPro: Matches new hires to best buddies/mentors with explanations, alternatives, and full decision log.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const BuddyProfileSchema = z.object({
  name: z.string(),
  profile: z.string(),
  strengths: z.array(z.string()),
  department: z.string().optional(),
  languages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

const AiBuddyMatchingProInputSchema = z.object({
  newHire: z.object({
    name: z.string(),
    profile: z.string(),
    department: z.string().optional(),
    preferences: z.string().optional(),
    language: z.string().optional(),
    mustAvoid: z.array(z.string()).optional().describe("Buddies to avoid if any"),
  }),
  buddies: z.array(BuddyProfileSchema),
  companyContext: z.string().optional(),
});
export type AiBuddyMatchingProInput = z.infer<typeof AiBuddyMatchingProInputSchema>;

const AiBuddyMatchingProOutputSchema = z.object({
  bestMatch: z.string(),
  reason: z.string(),
  top3: z.array(z.object({
    name: z.string(),
    reason: z.string(),
  })),
  decisionLog: z.array(z.string()),
});
export type AiBuddyMatchingProOutput = z.infer<typeof AiBuddyMatchingProOutputSchema>;

export async function aiBuddyMatchingPro(input: AiBuddyMatchingProInput): Promise<AiBuddyMatchingProOutput> {
  AiBuddyMatchingProInputSchema.parse(input);

  // Contextualiza empresa y preferencias
  const buddiesList = input.buddies.map((b, idx) => 
    `[${idx+1}] ${b.name} | Profile: ${b.profile} | Strengths: ${b.strengths.join(", ")} | Dept: ${b.department ?? "?"} | Languages: ${b.languages?.join(", ") ?? "?"} | Tags: ${b.tags?.join(", ") ?? ""}`
  ).join('\n');

  const mustAvoid = input.newHire.mustAvoid?.length
    ? `The following buddies must NOT be matched under any circumstances: ${input.newHire.mustAvoid.join(", ")}.`
    : "";

  const prompt = `
You are a highly skilled HR onboarding assistant, specialized in matching new hires with the most compatible onboarding buddy or mentor. Company context: ${input.companyContext || "(not provided)"}.

NEW HIRE:
Name: ${input.newHire.name}
Profile: ${input.newHire.profile}
Department: ${input.newHire.department ?? "N/A"}
Preferences: ${input.newHire.preferences ?? "N/A"}
Language: ${input.newHire.language ?? "N/A"}

BUDDY CANDIDATES:
${buddiesList}

${mustAvoid}

INSTRUCTIONS:
- Consider department, skills, language, and preferences.
- Give the best match as "bestMatch" and the reason in "reason".
- Also provide "top3" (array with name and reason for each).
- "decisionLog": array of the steps/reasoning used.
- Never choose from mustAvoid list.
- If no suitable match, say so.
- Output only the following strict JSON schema, NO extra comments:
{
  "bestMatch": "string",
  "reason": "string",
  "top3": [{"name": "string", "reason": "string"}],
  "decisionLog": ["string", ...]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Professional HR onboarding buddy-matching AI." },
      { role: "user", content: prompt }
    ],
    temperature: 0.1,
  });

  const outputText = completion.choices[0].message.content || "";
  let parsed: any = {};
  const match = outputText.match(/({[\s\S]+})/);
  try { if (match) parsed = JSON.parse(match[1]); } catch (e) {
    // fallback
    parsed = {
      bestMatch: "",
      reason: "",
      top3: [],
      decisionLog: ["OpenAI output parse error."]
    };
  }

  return AiBuddyMatchingProOutputSchema.parse(parsed);
}
