'use server';

/**
 * @fileOverview Generates sample training data and adaptive tests for onboarding (OpenAI version).
 *
 * - generateOnboardingTestData - A function that generates onboarding test data.
 * - GenerateOnboardingTestDataInput - The input type for the generateOnboardingTestData function.
 * - GenerateOnboardingTestDataOutput - The return type for the generateOnboardingTestData function.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const GenerateOnboardingTestDataInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for the training document and tests, e.g., "Company Culture".'),
  numQuestions: z
    .number()
    .min(3)
    .max(10)
    .default(5)
    .describe('The number of questions to generate for the adaptive test.'),
});
export type GenerateOnboardingTestDataInput = z.infer<typeof GenerateOnboardingTestDataInputSchema>;

const GenerateOnboardingTestDataOutputSchema = z.object({
  trainingDocument: z
    .string()
    .describe('A sample training document on the specified topic.'),
  testQuestions: z
    .array(z.string())
    .describe('An array of test questions based on the training document.'),
});
export type GenerateOnboardingTestDataOutput = z.infer<typeof GenerateOnboardingTestDataOutputSchema>;

export async function generateOnboardingTestData(
  input: GenerateOnboardingTestDataInput
): Promise<GenerateOnboardingTestDataOutput> {
  // Valida input (opcional)
  GenerateOnboardingTestDataInputSchema.parse(input);

  // Prompt para el training document
  const trainingDocumentPrompt = `
You are an expert in creating training documents.

Create a training document on the topic of "${input.topic}". The document should be suitable for onboarding new employees.
Do not include any questions in the document, just the content.
The training document should be at least 3 paragraphs long.

Training Document:
`;

  // 1. Genera el documento de formación
  const documentResponse = await openai.chat.completions.create({
    model: "gpt-4", // o "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful onboarding content generator." },
      { role: "user", content: trainingDocumentPrompt }
    ],
    temperature: 0.3,
  });

  const trainingDocument = documentResponse.choices[0].message.content?.trim() || "";

  // Prompt para las preguntas de test
  const testQuestionsPrompt = `
You are an expert in creating test questions based on training documents.

Create ${input.numQuestions} test questions based on the following training document.

Training Document:
${trainingDocument}

The questions should be multiple choice. Provide only questions, do not provide answers.

Test Questions (output as a JSON array of strings, e.g., ["Question 1", "Question 2", ...]):
`;

  // 2. Genera las preguntas de test
  const questionsResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You generate multiple choice onboarding test questions as JSON arrays." },
      { role: "user", content: testQuestionsPrompt }
    ],
    temperature: 0.3,
  });

  // Intenta extraer el array JSON del output
  let testQuestions: string[] = [];
  const questionsText = questionsResponse.choices[0].message.content || "";
  const match = questionsText.match(/(\[[\s\S]+\])/);
  if (match) {
    try {
      testQuestions = JSON.parse(match[1]);
    } catch (err) {
      // Fallback: intenta separar por saltos de línea si el JSON viene mal
      testQuestions = questionsText.split('\n').filter(Boolean).map(q => q.trim());
    }
  } else {
    // Fallback por si no devuelve JSON, separa por líneas
    testQuestions = questionsText.split('\n').filter(Boolean).map(q => q.trim());
  }

  // Valida y retorna output
  return GenerateOnboardingTestDataOutputSchema.parse({
    trainingDocument,
    testQuestions,
  });
}
