"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { generateAdaptiveQuiz, type GenerateAdaptiveQuizInput, type GenerateAdaptiveQuizOutput } from "@/ai/flows/quiz/generate-adaptive-quiz";
import type { QuizQuestion } from "@/types";
import { CheckCircle, ChevronLeft, ChevronRight, GraduationCap, Loader2, Sparkles, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const mockTrainingMaterials = `
NubbiAI Core Features:
- Role Dashboard: Separate views for admins and new hires.
- File Upload: Drag-and-drop interface for training materials.
- AI Assistant: Conversational AI for new hire questions. Uses company-specific documentation.
- Journey Tracker: Visual onboarding progress with gamification.
- Language Selection: Switch between English and Spanish.
- Performance Dashboard: KPIs like completion rates, quiz scores.
- Secure Authentication: Firebase Auth with role-based access control.
- Adaptive Testing: AI-powered quizzes based on training materials.
- Real-time Notifications: Updates, deadlines, feedback.
- GDPR Compliance: Data privacy and security.

Styling Principles:
- Primary Color: Delft Blue (#414066)
- Background Color: Battleship gray (#82816d)
- Accent Color: Lime (#ceff1a)
- Font: Clear, professional, sans-serif (e.g., Inter, Montserrat).
- Layout: Clean, modular, responsive.
`;

type QuizState = "config" | "loading" | "active" | "results";

export default function AdaptiveTestPage() {
  const [quizState, setQuizState] = useState<QuizState>("config");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();

  // Config state
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [trainingMaterials, setTrainingMaterials] = useState(mockTrainingMaterials);


  const startQuiz = async () => {
    setQuizState("loading");
    try {
      const input: GenerateAdaptiveQuizInput = { 
        trainingMaterials, 
        userLevel, 
        numberOfQuestions 
      };
      const result: GenerateAdaptiveQuizOutput = await generateAdaptiveQuiz(input);
      setQuestions(result.quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setScore(null);
      setQuizState("active");
      toast({ title: "Quiz Ready!", description: `Your ${userLevel} quiz with ${numberOfQuestions} questions is ready.` });
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast({ title: "Quiz Generation Failed", description: "Could not generate the quiz. Please try again.", variant: "destructive" });
      setQuizState("config");
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const calculatedScore = (correctAnswers / questions.length) * 100;
    setScore(calculatedScore);
    setQuizState("results");
    toast({ title: "Quiz Submitted!", description: `Your score is ${calculatedScore.toFixed(0)}%.` });
  };

  const resetQuiz = () => {
    setQuizState("config");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (quizState === "loading") {
    return (
      <Card className="shadow-xl min-h-[500px] flex flex-col items-center justify-center">
        <CardContent className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
          <p className="text-xl text-muted-foreground">Generating your adaptive quiz...</p>
          <p className="text-sm text-muted-foreground">This might take a moment.</p>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "config") {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-7 w-7 text-primary" /> Adaptive Testing Center
          </CardTitle>
          <CardDescription>
            Configure and start a new adaptive quiz based on selected training materials and difficulty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="userLevel" className="text-base">Select Difficulty Level</Label>
            <Select value={userLevel} onValueChange={(val) => setUserLevel(val as any)}>
              <SelectTrigger id="userLevel" className="mt-1 h-11 text-base">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="numQuestions" className="text-base">Number of Questions (3-10)</Label>
            <Input 
              id="numQuestions" 
              type="number" 
              value={numberOfQuestions} 
              onChange={(e) => setNumberOfQuestions(Math.max(3, Math.min(10, parseInt(e.target.value))))} 
              min="3" max="10" 
              className="mt-1 h-11 text-base"
            />
          </div>
          {/* In a real app, trainingMaterials might be selectable or dynamically loaded */}
           <p className="text-sm text-muted-foreground">
              Quiz will be based on pre-loaded NubbiAI features and styling principles.
          </p>
          <Button onClick={startQuiz} size="lg" className="w-full h-12 text-lg">
            <Sparkles className="mr-2 h-5 w-5" /> Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "results" && score !== null) {
    return (
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
          <CardDescription>You scored {score.toFixed(0)}%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg text-center ${score >= 70 ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
            {score >= 70 ? <CheckCircle className="h-16 w-16 mx-auto mb-4" /> : <XCircle className="h-16 w-16 mx-auto mb-4" />}
            <p className="text-2xl font-semibold">{score >= 70 ? "Congratulations! You passed!" : "Keep Learning! You can do better."}</p>
          </div>
          <Alert>
            <AlertTitle>Review Your Answers</AlertTitle>
            <AlertDescription>
                Go through the questions again to see correct answers and where you can improve.
            </AlertDescription>
          </Alert>
          <ScrollArea className="max-h-[300px] pr-2">
          {questions.map((q, index) => (
            <div key={index} className={`p-3 mb-2 border rounded-md ${userAnswers[index] === q.correctAnswer ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'}`}>
              <p className="font-semibold text-sm">{index + 1}. {q.question}</p>
              <p className="text-xs mt-1">Your answer: <span className="font-medium">{userAnswers[index] || "Not answered"}</span></p>
              <p className="text-xs">Correct answer: <span className="font-medium text-green-600">{q.correctAnswer}</span></p>
            </div>
          ))}
          </ScrollArea>
          <Button onClick={resetQuiz} className="w-full" size="lg">Take Another Quiz</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (quizState === "active" && currentQuestion) {
    return (
      <Card className="shadow-xl flex flex-col min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <Badge variant="secondary">{userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Level</Badge>
          </CardTitle>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-2 h-2" />
          <CardDescription className="pt-4 text-base md:text-lg min-h-[60px]">{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <RadioGroup
            value={userAnswers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <span className="text-sm md:text-base">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={submitQuiz} disabled={!userAnswers[currentQuestionIndex]} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" /> Submit Quiz
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={!userAnswers[currentQuestionIndex]}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  return <Card><CardContent><p>Something went wrong with the quiz state.</p></CardContent></Card>
}
