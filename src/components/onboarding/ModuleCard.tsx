import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: string; // "20 min"
  videoUrl?: string;
  quizAvailable?: boolean;
  role?: "admin" | "new-hire" | "manager";
}

interface ModuleCardProps {
  module: OnboardingModule;
  showVideo?: boolean;
}

export function ModuleCard({ module, showVideo = false }: ModuleCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Estimated time: {module.estimatedTime}</p>

        {showVideo && module.videoUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <video controls className="w-full h-full object-cover rounded-xl">
              <source src={module.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link href={`/onboarding/${module.id}`}>
            <Button size="sm" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Start Module
            </Button>
          </Link>
          {module.quizAvailable && <span className="text-xs text-green-600">Includes quiz</span>}
        </div>
      </CardContent>
    </Card>
  );
}
