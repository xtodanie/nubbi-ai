"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpenCheck, Loader2, Wand2 } from "lucide-react";
import React, { useState } from "react";
import { generateOnboardingTestData, type GenerateOnboardingTestDataInput, type GenerateOnboardingTestDataOutput } from "@/ai/flows/quiz/generate-onboarding-test-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function TestGenerationPage() {
  const [topic, setTopic] = useState("Company Culture");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateOnboardingTestDataOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateTestData = async () => {
    setIsLoading(true);
    setGeneratedData(null);
    try {
      const input: GenerateOnboardingTestDataInput = { topic, numQuestions };
      const result = await generateOnboardingTestData(input);
      setGeneratedData(result);
      toast({ title: "Test Data Generated", description: "Training document and questions created successfully." });
    } catch (error) {
      console.error("Failed to generate test data:", error);
      toast({ title: "Generation Failed", description: "Could not generate test data. Check console for errors.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpenCheck className="h-7 w-7 text-primary" /> AI Test & Data Generation
          </CardTitle>
          <CardDescription>
            Generate sample training documents and adaptive test questions using AI based on a specific topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Company Security Policies"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Input
                id="numQuestions"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                min="3"
                max="10"
              />
            </div>
          </div>
          <Button onClick={handleGenerateTestData} disabled={isLoading} className="mt-6 w-full md:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Data
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Generating content... Please wait.</p>
          </CardContent>
        </Card>
      )}

      {generatedData && (
        <Card className="shadow-xl mt-6">
          <CardHeader>
            <CardTitle>Generated Content for "{topic}"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Training Document</h3>
              <ScrollArea className="h-[300px] p-4 border rounded-md bg-muted/30">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedData.trainingDocument}</pre>
              </ScrollArea>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Test Questions ({generatedData.testQuestions.length})</h3>
              <ScrollArea className="h-[300px] p-4 border rounded-md bg-muted/30">
                <ul className="space-y-3">
                  {generatedData.testQuestions.map((question, index) => (
                    <li key={index} className="text-sm p-2 border-b border-border/50">
                      <strong>Q{index + 1}:</strong> {question}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
             <div className="flex justify-end space-x-3 mt-4">
                <Button variant="outline">Save Document</Button>
                <Button>Save Questions for Review</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
