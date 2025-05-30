'use server';

/**
 * @fileOverview Personalized feedback and development plan for onboarding.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const FeedbackGrowthInputSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  answers: z.array(z.object({
    question: z.string(),
    userAnswer: z.string(),
    correctAnswer: z.string(),
    explanation: z.string().optional(),
    timestamp: z.string().optional(),
  })),
  courseName: z.string().optional(),
  recentComments: z.array(z.string()).optional(),
});
export type FeedbackGrowthInput = z.infer<typeof FeedbackGrowthInputSchema>;

const FeedbackGrowthOutputSchema = z.object({
  summary: z.string(),
  improvementAreas: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  suggestedResources: z.array(z.string()),
  redFlagAlert: z.string().optional(),
});
export type FeedbackGrowthOutput = z.infer<typeof FeedbackGrowthOutputSchema>;

export async function feedbackGrowthPlanPro(input: FeedbackGrowthInput): Promise<FeedbackGrowthOutput> {
  FeedbackGrowthInputSchema.parse(input);

  const answersFormatted = input.answers.map(a =>
    `Q: ${a.question}\nUser: ${a.userAnswer}\nCorrect: ${a.correctAnswer}\nExplain: ${a.explanation ?? ""}`
  ).join('\n---\n');

  const prompt = `
You are a world-class onboarding and learning coach. Analyze the user's onboarding results and generate:
- A 2-3 sentence summary of performance and attitude.
- "improvementAreas": 3-5 concrete areas needing improvement.
- "recommendedActions": 3-5 next steps or habits to adopt.
- "suggestedResources": 2-4 links or topics to review (example: "Company Code of Conduct", "Time Management Tips").
- If you detect a serious problem (cheating, very low performance, hostile answers, etc.), set "redFlagAlert" for HR/manager.

User: ${input.userName} (ID: ${input.userId})
Course: ${input.courseName ?? "N/A"}

Recent comments: ${input.recentComments?.join(" | ") ?? "None"}

ANSWERS:
${answersFormatted}

Output strict JSON:
{
  "summary": "...",
  "improvementAreas": ["...", "..."],
  "recommendedActions": ["..."],
  "suggestedResources": ["..."],
  "redFlagAlert": "..."
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Personalized onboarding coach and feedback plan generator." },
      { role: "user", content: prompt }
    ],
    temperature: 0.15,
  });

  const outputText = completion.choices[0].message.content || "";
  let parsed: any = {};
  const match = outputText.match(/({[\s\S]+})/);
  try { if (match) parsed = JSON.parse(match[1]); } catch (e) {
    parsed = { summary: "", improvementAreas: [], recommendedActions: [], suggestedResources: [], redFlagAlert: "Could not parse AI output." };
  }
  return FeedbackGrowthOutputSchema.parse(parsed);
}
