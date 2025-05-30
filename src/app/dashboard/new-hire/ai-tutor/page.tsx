"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Loader2, Send, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { answerNewHireQuestion, type AnswerNewHireQuestionInput, type AnswerNewHireQuestionOutput } from "@/ai/flows/social/answer-new-hire-question";
import { marked } from 'marked'; // For rendering markdown if AI responses include it

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  relevantDocs?: string;
}

const mockCompanyDocs = `
Company Vacation Policy:
- Employees are entitled to 20 paid vacation days per year after a 3-month probationary period.
- Vacation requests must be submitted at least 2 weeks in advance via the HR portal.
- Unused vacation days up to 5 can be carried over to the next year.

Company Expense Policy:
- All work-related expenses must be pre-approved by a manager if over $100.
- Expense reports must be submitted within 30 days of incurring the expense.
- Use the company's designated travel agency for flight and hotel bookings.

Company Code of Conduct:
- Maintain professionalism and respect in all interactions.
- Protect company confidential information.
- Report any unethical behavior to HR or through the anonymous hotline.
`;

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiInput: AnswerNewHireQuestionInput = { question: input, companyDocs: mockCompanyDocs };
      const result: AnswerNewHireQuestionOutput = await answerNewHireQuestion(aiInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer,
        sender: "ai",
        relevantDocs: result.relevantDocs
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      toast({ title: "Error", description: "Could not get an answer from AI Tutor.", variant: "destructive" });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sanitizeAndRenderHTML = (htmlString: string) => {
    // Basic sanitization, in a real app use a robust library like DOMPurify
    const sanitized = htmlString.replace(/<script.*?>.*?<\/script>/gi, '');
    return { __html: sanitized };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)]"> {/* Adjust height based on header/footer */}
      <Card className="flex-1 flex flex-col shadow-xl overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-7 w-7 text-primary" /> AI Tutor
          </CardTitle>
          <CardDescription>
            Ask questions about company policies, procedures, or anything related to your onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 md:p-6" ref={scrollAreaRef as any}> {/* Type assertion for ScrollArea's internal ref */}
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <Avatar className="h-9 w-9 border border-primary/50">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] p-3 rounded-xl shadow ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted text-muted-foreground rounded-bl-none'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={sanitizeAndRenderHTML(marked.parse(msg.text) as string)} className="prose prose-sm dark:prose-invert max-w-none" />
                    {msg.relevantDocs && (
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer hover:underline">Show relevant documents</summary>
                        <pre className="mt-1 p-2 bg-background/50 rounded text-foreground whitespace-pre-wrap max-h-40 overflow-auto">{msg.relevantDocs}</pre>
                      </details>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback><User size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border border-primary/50">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[70%] p-3 rounded-xl shadow bg-muted text-muted-foreground rounded-bl-none">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-3">
            <Input
              type="text"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-11 text-base"
              aria-label="Ask AI Tutor"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="h-11">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
