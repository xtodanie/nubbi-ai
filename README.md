# Nubbi AI – Training Intelligence Platform

This is a production-ready, fully styled, structured onboarding app using:

- Next.js (App Router)
- TypeScript
- TailwindCSS with custom tokens (`hsl(var(--token))`)
- Shadcn UI components only
- Firebase Auth (already configured)
- Supabase Storage (via `/lib/uploadToSupabase.ts`)
- AI agents via OpenAI / Claude (under `/ai/flows`)

DO NOT modify or re-style any component or layout.

You are here to help complete missing modules:

- `useUploadQueue.ts` (upload logic)
- `UploadCard.tsx` (per-file visual UI)
- `onboarding-agent-real.ts` (real agent pipeline)
- `preferences.tsx` (survey)
- `my-journey/page.tsx` (user journey)
- `module/[id]/page.tsx` (quiz inside module)
- `InsightCard.tsx` (admin feedback)

You must preserve:
- Colors (`--primary`, `--sidebar-background`, `--chart-1`, etc.)
- Layouts
- UI library (shadcn/ui)

Use tailwind.config.ts for reference.

Every new file must match the same quality, structure, and style.
