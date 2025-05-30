import { NextResponse } from 'next/server';
import { generateEnterpriseOnboarding,
  GlobalOnboardingInputSchema,
  GlobalOnboardingInput,
} from '@/lib/global/GlobalAutoOnboardingOrchestrator'; // Corrected import path using @root-lib alias
import { ZodError } from 'zod';

// Define the POST handler for the API route
export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const input: GlobalOnboardingInput = await request.json();

    // Validate the input using the Zod schema
    GlobalOnboardingInputSchema.parse(input);

    // Generate the onboarding curriculum using the orchestrator function
    const onboardingOutput = await generateEnterpriseOnboarding(input);

    // Return the generated curriculum as a JSON response
    return NextResponse.json(onboardingOutput, { status: 200 });

  } catch (error: any) {
    console.error("API Error generating onboarding:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }

    // Handle errors from the onboarding generation function
    return NextResponse.json({ error: error.message || 'Failed to generate onboarding curriculum' }, { status: 500 });
  }
}

// Define a GET handler (optional, but good practice to include)
export async function GET() {
  return NextResponse.json({ message: 'This endpoint only supports POST requests.' }, { status: 405 });
}