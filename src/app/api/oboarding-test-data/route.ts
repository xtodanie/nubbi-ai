// src/app/api/onboarding-test-data/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateOnboardingTestData } from "@/ai/flows/quiz/generate-onboarding-test-data";

// Opcional: protege solo para POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Llama tu función de AI (valida input adentro)
    const result = await generateOnboardingTestData({
      topic: body.topic,
      numQuestions: body.numQuestions,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
