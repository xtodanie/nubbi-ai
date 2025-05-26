"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { OnboardingModule } from "@/types";
import { CheckCircle, ClipboardList, Award, Rocket, Target } from "lucide-react";
import React, { useState } from "react";

const mockJourney: OnboardingModule[] = [
  { id: 'm1', title: "Welcome & Company Overview", description: "Get to know our company, mission, and values.", estimatedTime: "1 hour", completed: true, 
    subModules: [
      { id: 'sm1-1', title: "CEO Welcome Message", description: "A message from our CEO.", estimatedTime: "15 mins", completed: true},
      { id: 'sm1-2', title: "Our Core Values", description: "Understand what drives us.", estimatedTime: "30 mins", completed: true},
      { id: 'sm1-3', title: "Company History", description: "Learn about our journey.", estimatedTime: "15 mins", completed: true},
    ]
  },
  { id: 'm2', title: "Understanding Your Role", description: "Deep dive into your responsibilities and team structure.", estimatedTime: "2 hours", completed: true,
    subModules: [
      { id: 'sm2-1', title: "Role Expectations", description: "Clarify your key tasks.", estimatedTime: "45 mins", completed: true},
      { id: 'sm2-2', title: "Meet Your Team", description: "Introduction to team members.", estimatedTime: "30 mins", completed: true},
      { id: 'sm2-3', title: "Tools & Software Setup", description: "Get your accounts ready.", estimatedTime: "45 mins", completed: true},
    ]
  },
  { id: 'm3', title: "Essential Tools & Software", description: "Learn the tools you'll use daily.", estimatedTime: "3 hours", completed: false,
    subModules: [
      { id: 'sm3-1', title: "Communication Platforms", description: "Slack, Email, etc.", estimatedTime: "1 hour", completed: true},
      { id: 'sm3-2', title: "Project Management Software", description: "Jira/Asana overview.", estimatedTime: "1 hour", completed: false},
      { id: 'sm3-3', title: "HR Portal Navigation", description: "Accessing HR resources.", estimatedTime: "1 hour", completed: false},
    ]
  },
  { id: 'm4', title: "Compliance & Security Training", description: "Understand important policies and procedures.", estimatedTime: "2 hours", completed: false },
  { id: 'm5', title: "First Project Kick-off", description: "Get started on your first assignment.", estimatedTime: "Ongoing", completed: false },
];

export default function JourneyPage() {
  const [journeyModules, setJourneyModules] = useState<OnboardingModule[]>(mockJourney);

  const completedModules = journeyModules.filter(m => m.completed).length;
  const totalModules = journeyModules.length;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const toggleModuleCompletion = (moduleId: string) => {
    setJourneyModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId ? { ...module, completed: !module.completed } : module
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ClipboardList className="h-7 w-7 text-primary" /> My Onboarding Journey
          </CardTitle>
          <CardDescription>
            Track your progress through the onboarding modules. Complete all modules to become fully onboarded!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-primary/10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-primary">Overall Progress</h3>
              <Badge variant={progressPercentage === 100 ? "default" : "secondary"} className="text-sm">
                {completedModules} / {totalModules} Modules Completed
              </Badge>
            </div>
            <Progress value={progressPercentage} className="w-full h-3 [&>div]:bg-accent" />
            {progressPercentage === 100 && (
                <div className="mt-4 p-4 bg-green-500/10 text-green-700 rounded-md flex items-center gap-2">
                    <Award className="h-6 w-6"/> 
                    <p className="font-semibold">Congratulations! You've completed your onboarding journey!</p>
                </div>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {journeyModules.map((module, index) => (
              <AccordionItem value={`item-${index}`} key={module.id} className="border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {module.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Target className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-card-foreground">{module.title}</h4>
                      <p className="text-xs text-muted-foreground">{module.estimatedTime}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 border-t">
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  {module.subModules && module.subModules.length > 0 && (
                    <div className="space-y-2 mb-3 pl-4 border-l-2 border-primary/30">
                      {module.subModules.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between text-sm py-1">
                           <div className="flex items-center gap-2">
                            {sub.completed ? <CheckCircle className="h-4 w-4 text-green-500"/> : <Rocket className="h-4 w-4 text-yellow-500/70"/>}
                            <span>{sub.title} ({sub.estimatedTime})</span>
                           </div>
                           {!sub.completed && <Button size="xs" variant="outline">Start</Button>}
                        </div>
                      ))}
                    </div>
                  )}
                  {!module.completed ? (
                    <Button onClick={() => toggleModuleCompletion(module.id)} size="sm">Mark as Complete</Button>
                  ) : (
                     <Button onClick={() => toggleModuleCompletion(module.id)} size="sm" variant="outline">Mark as Incomplete</Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
