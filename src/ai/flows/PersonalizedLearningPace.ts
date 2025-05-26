'use server';

/**
 * @fileOverview Personalized Learning Pace & Deadline Engine for onboarding.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const LearningPaceInputSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  completedModules: z.array(z.object({
    moduleId: z.string(),
    moduleName: z.string(),
    startedAt: z.string(),
    completedAt: z.string(),
    score: z.number().min(0).max(100).optional(),
  })),
  totalModules: z.number(),
  declaredAvailabilityMinsPerDay: z.number(),
  onboardingEndDate: z.string(),
  allowEarlyProduction: z.boolean().default(true),
});
export type LearningPaceInput = z.infer<typeof LearningPaceInputSchema>;

const LearningPaceOutputSchema = z.object({
  estimatedFinishDate: z.string(),
  fastLearner: z.boolean(),
  badge: z.string().optional(),
  unlocks: z.array(z.string()),
  newDeadlines: z.array(z.object({
    moduleId: z.string(),
    recommendedDeadline: z.string(),
  })),
  managerAlert: z.string().optional(),
  explainability: z.array(z.string()),
});
export type LearningPaceOutput = z.infer<typeof LearningPaceOutputSchema>;

export async function learningPaceDeadlineEngine(input: LearningPaceInput): Promise<LearningPaceOutput> {
  LearningPaceInputSchema.parse(input);

  // Preparamos módulos y datos en formato amigable
  const modulesStr = input.completedModules.map((m, idx) =>
    `[${idx + 1}] ${m.moduleName} (ID: ${m.moduleId}) - Started: ${m.startedAt}, Completed: ${m.completedAt}${m.score !== undefined ? `, Score: ${m.score}` : ""}`
  ).join('\n');

  const prompt = `
You are a Learning Pace & Deadline AI for onboarding.
Tasks:
- Analyze completed modules and user availability.
- Predict if the user is a fast learner (finishes modules earlier than predicted and with good scores).
- If fast learner, recommend early unlocks or early access to production.
- For slow progress, recommend new deadlines and alert manager if needed.
- If eligible, assign badge (e.g., "Fast Learner", "Record Breaker").
- Log every reasoning step in "explainability".
- Output strict JSON:

{
  "estimatedFinishDate": "YYYY-MM-DD",
  "fastLearner": true/false,
  "badge": "string",
  "unlocks": ["..."],
  "newDeadlines": [{"moduleId": "...", "recommendedDeadline": "YYYY-MM-DD"}],
  "managerAlert": "string (if any)",
  "explainability": ["reason step 1", "reason step 2", ...]
}

USER: ${input.userName} (ID: ${input.userId})
DECLARED AVAILABILITY: ${input.declaredAvailabilityMinsPerDay} minutes/day
ONBOARDING END DATE: ${input.onboardingEndDate}
TOTAL MODULES: ${input.totalModules}
COMPLETED MODULES:
${modulesStr}

Instructions: Be strict. For fast learners, be generous with badges and unlocks. For slow progress, be clear with new deadlines and manager alerts.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Learning pace & deadline AI for onboarding. Strict JSON output, explain every step." },
      { role: "user", content: prompt }
    ],
    temperature: 0.1,
  });

  const outputText = completion.choices[0].message.content || "";
  let parsed: any = {};
  const match = outputText.match(/({[\s\S]+})/);
  try { if (match) parsed = JSON.parse(match[1]); } catch (e) {
    parsed = {
      estimatedFinishDate: "",
      fastLearner: false,
      badge: "",
      unlocks: [],
      newDeadlines: [],
      managerAlert: "Could not parse AI output.",
      explainability: ["Parse error in OpenAI output."],
    };
  }
  return LearningPaceOutputSchema.parse(parsed);
}
