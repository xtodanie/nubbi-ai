'use server';

import { openai } from '@/ai/openai';
import { z } from 'zod';

const InputSchema = z.object({
  question: z.string(),
  docs: z.array(z.object({
    title: z.string(),
    body: z.string(),
    ref: z.string(), // por ejemplo: url o id del documento
  })),
});
export type QAContextualInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  answer: z.string(),
  sources: z.array(z.object({
    title: z.string(),
    fragment: z.string(),
    ref: z.string(),
  })),
});
export type QAContextualOutput = z.infer<typeof OutputSchema>;

export async function qaContextualMultiDoc(input: QAContextualInput): Promise<QAContextualOutput> {
  InputSchema.parse(input);

  const context = input.docs.map(doc => `TITLE: ${doc.title}\nREF: ${doc.ref}\nBODY: ${doc.body}`).join('\n---\n');
  const prompt = `
You are an expert onboarding assistant. You have access to several documents. For the user's question, you MUST:
- Answer using ONLY the provided docs.
- Quote up to 3 relevant fragments, each with the doc title and ref.
- If you cannot answer, say so.

DOCUMENTS:
${context}

QUESTION:
${input.question}

RETURN JSON:
{
  "answer": "...",
  "sources": [
    {"title": "...", "fragment": "...", "ref": "..."}
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Onboarding multi-doc QA with citations." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const match = completion.choices[0].message.content?.match(/({[\s\S]+})/);
  let parsed: any = {};
  try { if (match) parsed = JSON.parse(match[1]); } catch {}
  return OutputSchema.parse(parsed);
}
