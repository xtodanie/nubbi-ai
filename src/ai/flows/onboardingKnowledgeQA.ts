'use server';

import { openai } from '@/ai/openai';
import { z } from 'zod';

const InputSchema = z.object({
  question: z.string(),
  companyDocs: z.string(),
});
export type OnboardingKnowledgeQAInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  answer: z.string(),
  sources: z.string(),
});
export type OnboardingKnowledgeQAOutput = z.infer<typeof OutputSchema>;

export async function onboardingKnowledgeQA(input: OnboardingKnowledgeQAInput): Promise<OnboardingKnowledgeQAOutput> {
  InputSchema.parse(input);

  const prompt = `
You are a top onboarding assistant. Answer the employee's question using ONLY the documentation provided. If you don't know, say you can't answer.

Documentation:
${input.companyDocs}

Question: ${input.question}

Answer (be precise, quote the doc when possible, and at the end add 'Sources: ...'):
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Onboarding AI expert assistant. Use only the given docs for answers." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const outputText = completion.choices[0].message.content || "";

  // Extract answer and sources (if present)
  let answer = outputText;
  let sources = "";
  const match = outputText.match(/Sources:\s*([\s\S]+)$/i);
  if (match) {
    answer = outputText.replace(match[0], "").trim();
    sources = match[1].trim();
  }

  return OutputSchema.parse({
    answer,
    sources,
  });
}
