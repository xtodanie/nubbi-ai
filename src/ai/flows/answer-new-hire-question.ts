'use server';

/**
 * @fileOverview AI agent to answer questions from new hires based on company documentation (OpenAI version).
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const AnswerNewHireQuestionInputSchema = z.object({
  question: z.string().describe('The question from the new hire.'),
  companyDocs: z.string().describe('Company-specific documentation to answer the question.'),
});
export type AnswerNewHireQuestionInput = z.infer<typeof AnswerNewHireQuestionInputSchema>;

const AnswerNewHireQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the new hire question, based on the company documentation.'),
  relevantDocs: z.string().describe('The relevant documentation used to answer the question.'),
});
export type AnswerNewHireQuestionOutput = z.infer<typeof AnswerNewHireQuestionOutputSchema>;

export async function answerNewHireQuestion(
  input: AnswerNewHireQuestionInput
): Promise<AnswerNewHireQuestionOutput> {
  // Valida el input (opcional, pero recomendado)
  AnswerNewHireQuestionInputSchema.parse(input);

  // Construye el prompt
  const systemPrompt = `
You are an AI assistant helping new hires onboard by answering their questions about company policies and procedures.

Answer the question based on the following company documentation:
${input.companyDocs}

Question: ${input.question}

Answer (provide the answer first, then cite the most relevant part of the docs as 'Relevant Docs'):
`;

  // Llama a OpenAI (usando gpt-4 o el modelo que prefieras)
  const completion = await openai.chat.completions.create({
    model: "gpt-4", // o "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You answer as a helpful onboarding assistant. Be concise and cite relevant documentation." },
      { role: "user", content: systemPrompt },
    ],
    temperature: 0.3,
  });

  // Extrae el texto de respuesta
  const outputText = completion.choices[0].message.content || "";

  // Separa la respuesta y los docs relevantes, si los hay
  let answer = outputText;
  let relevantDocs = "";
  const match = outputText.match(/Relevant Docs:\s*(.+)$/is);
  if (match) {
    answer = outputText.replace(match[0], "").trim();
    relevantDocs = match[1].trim();
  }

  // Valida y devuelve el output (opcional pero recomendable)
  const result = AnswerNewHireQuestionOutputSchema.parse({
    answer,
    relevantDocs,
  });
  return result;
}
