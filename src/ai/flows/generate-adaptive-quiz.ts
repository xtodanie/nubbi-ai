'use server';

/**
 * @fileOverview Generates adaptive quizzes based on training materials (OpenAI version).
 *
 * - generateAdaptiveQuiz - A function that generates a quiz based on the provided training materials.
 * - GenerateAdaptiveQuizInput - The input type for the generateAdaptiveQuiz function.
 * - GenerateAdaptiveQuizOutput - The return type for the generateAdaptiveQuiz function.
 */

import { openai } from '@/ai/openai';
import { z } from 'zod';

const GenerateAdaptiveQuizInputSchema = z.object({
  trainingMaterials: z
    .string()
    .describe('The training materials to generate the quiz from.'),
  userLevel: z
    .string()
    .describe('The current user level, which can be beginner, intermediate, or advanced.'),
  numberOfQuestions: z
    .number()
    .describe('The number of questions to generate for the quiz.'),
});
export type GenerateAdaptiveQuizInput = z.infer<typeof GenerateAdaptiveQuizInputSchema>;

const GenerateAdaptiveQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions, options and answers.'),
});
export type GenerateAdaptiveQuizOutput = z.infer<typeof GenerateAdaptiveQuizOutputSchema>;

export async function generateAdaptiveQuiz(input: GenerateAdaptiveQuizInput): Promise<GenerateAdaptiveQuizOutput> {
  // Valida input (opcional)
  GenerateAdaptiveQuizInputSchema.parse(input);

  const prompt = `
You are an expert quiz generator, skilled at creating quizzes tailored to different understanding levels.

Based on the provided training materials, generate a quiz with the specified number of questions. The quiz should be appropriate for the specified user level (beginner, intermediate, or advanced).

Training Materials: ${input.trainingMaterials}
User Level: ${input.userLevel}
Number of Questions: ${input.numberOfQuestions}

Ensure that the quiz questions are clear, concise, and relevant to the training materials. Provide a range of plausible answer options for each question and clearly indicate the correct answer.

The quiz should test the user's understanding of the key concepts covered in the training materials and help them identify areas where they need more focus.
Output the quiz in the following JSON format:
{
  "quiz": [
    {
      "question": "Question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "Question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    }
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4", // O "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You generate adaptive quizzes as JSON for onboarding and training." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  // Intenta extraer el JSON del output
  const outputText = completion.choices[0].message.content || "";

  // Busca el JSON usando expresión regular
  const match = outputText.match(/({[\s\S]*})/);
  let quizObj = { quiz: [] };
  if (match) {
    try {
      quizObj = JSON.parse(match[1]);
    } catch (err) {
      // Fallback si el JSON está mal formateado
      console.error("JSON parse error in AI output:", err);
    }
  }

  // Valida el output y devuelve
  return GenerateAdaptiveQuizOutputSchema.parse(quizObj);
}
