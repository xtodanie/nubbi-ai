// src/ai/openai.ts

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY is not defined. Make sure .env.local is correctly configured.");
}

// Solo para server-side: nunca incluyas el apiKey en código que pueda llegar al browser.
// La variable de entorno debe estar en .env.local con:
// OPENAI_API_KEY=process.env.OPENAI_API_KEY

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Node.js/Server: la lee de tus env
});