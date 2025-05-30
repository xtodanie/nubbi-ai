// src/ai/openai.ts -> src/ai/anthropic.ts (conceptually, renaming the export)

import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("❌ ANTHROPIC_API_KEY is not defined. Make sure .env.local is correctly configured.");
}

// Solo para server-side: nunca incluyas el apiKey en código que pueda llegar al browser.
// La variable de entorno debe estar en .env.local con:
// ANTHROPIC_API_KEY=process.env.ANTHROPIC_API_KEY

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!, // Node.js/Server: la lee de tus env
});