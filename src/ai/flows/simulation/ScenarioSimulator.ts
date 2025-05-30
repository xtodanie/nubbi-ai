'use server';

/**
 * @fileOverview Scenario Simulator PRO: branching flow
 *
 * - simulateScenarioBranching - Simulates a scenario, gives feedback, determines next step dynamically.
 * - ScenarioBranchInput - Input type.
 * - ScenarioBranchOutput - Output type.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const ScenarioStepSchema = z.object({
  id: z.string().min(1),
  scenario: z.string(),
  aiRole: z.string(),
});

const UserActionSchema = z.object({
  userStepId: z.string(),
  userAnswer: z.string(),
});

const ScenarioBranchInputSchema = z.object({
  userId: z.string(),
  history: z.array(z.object({
    step: ScenarioStepSchema,
    action: UserActionSchema,
    aiFeedback: z.string().optional(),
    nextStepId: z.string().optional(),
  })),
  currentStep: ScenarioStepSchema,
  userAnswer: z.string(),
  possibleNextSteps: z.array(ScenarioStepSchema).describe("Possible next branches for the scenario"),
});
export type ScenarioBranchInput = z.infer<typeof ScenarioBranchInputSchema>;

const ScenarioBranchOutputSchema = z.object({
  aiFeedback: z.string().describe("Detailed feedback to the user's answer, including positive and negative points."),
  chosenNextStep: ScenarioStepSchema.describe("The next scenario step, chosen dynamically based on the user's answer."),
  branchReason: z.string().describe("Why this next step was chosen for the user."),
  summaryPath: z.string().describe("Summary of the scenario path so far."),
  decisionLog: z.array(z.string()).describe("AI reasoning and decision log for audit/debug."),
});
export type ScenarioBranchOutput = z.infer<typeof ScenarioBranchOutputSchema>;

export async function simulateScenarioBranching(input: ScenarioBranchInput): Promise<ScenarioBranchOutput> {
  ScenarioBranchInputSchema.parse(input);

  // Build conversation history for context
  const historyStr = input.history.map((h, idx) =>
    `Step ${idx + 1}: [${h.step.id}] "${h.step.scenario}"\nUser: "${h.action.userAnswer}"\nAI Feedback: "${h.aiFeedback || ''}"\nNextStep: ${h.nextStepId || 'N/A'}`
  ).join('\n\n') || "No previous steps (first step)";

  // Build next steps context
  const nextStepsStr = input.possibleNextSteps.map(s =>
    `[${s.id}] (${s.aiRole}) "${s.scenario}"`
  ).join('\n');

  // Prompt — instructions, schema, rules
  const prompt = `
You are a world-class onboarding scenario simulator for enterprise SaaS.
- You must act as the AI role (${input.currentStep.aiRole}) in a real-world scenario.
- Review the conversation and decisions so far (history).
- For the user's latest answer, give detailed feedback, noting strengths and weaknesses.
- Choose the best next step among the options provided. Justify the decision in detail.
- Return your answer as a strict JSON with NO extra comments.

If the user's answer is unsafe, off-topic, or breaks company policy, give strict feedback and choose a "correction" step if available.

CONVERSATION HISTORY:
${historyStr}

CURRENT STEP [${input.currentStep.id}]:
Role: ${input.currentStep.aiRole}
Scenario: ${input.currentStep.scenario}

USER ANSWER:
"${input.userAnswer}"

POSSIBLE NEXT STEPS:
${nextStepsStr}

INSTRUCTIONS:
- Pick only from possibleNextSteps, return the chosen step as JSON.
- Provide "aiFeedback" (strict, professional, actionable).
- Provide "branchReason" (why that step was chosen).
- Provide "summaryPath" (one line summary of the story so far).
- Provide "decisionLog" (array, step by step reasoning).

Return only this schema (strictly):
{
  "aiFeedback": "string",
  "chosenNextStep": {
    "id": "string",
    "scenario": "string",
    "aiRole": "string"
  },
  "branchReason": "string",
  "summaryPath": "string",
  "decisionLog": ["string", ...]
}
`;

  // Call OpenAI, max robustness, temperature low for determinism
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Branching scenario simulator for onboarding, strict output, no hallucination." },
      { role: "user", content: prompt }
    ],
    temperature: 0.1,
  });

  // Parse robustly: try strict JSON, else fallback
  let parsed: any = {};
  const outputText = completion.choices[0].message.content || "";
  const match = outputText.match(/({[\s\S]+})/);
  try { if (match) parsed = JSON.parse(match[1]); } catch (e) { console.error("Scenario parse error", e); }

  // Fallback defaults
  if (!parsed.chosenNextStep || !parsed.aiFeedback) {
    parsed = {
      aiFeedback: "There was an error in processing the scenario.",
      chosenNextStep: input.possibleNextSteps[0],
      branchReason: "Defaulted to first option due to parse error.",
      summaryPath: "N/A",
      decisionLog: ["OpenAI output parse error."]
    };
  }

  return ScenarioBranchOutputSchema.parse(parsed);
}
