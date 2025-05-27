
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users, HelpCircle, Lightbulb } from "lucide-react";

interface WouldYouRatherQuestion {
  id: string;
  optionA: string;
  optionB: string;
}

const questions: WouldYouRatherQuestion[] = [
  { id: "wyr1", optionA: "Have dinner with Queen Esther", optionB: "Have dinner with Ruth" },
  { id: "wyr2", optionA: "Lead a small group Bible study", optionB: "Write a daily devotional blog" },
  { id: "wyr3", optionA: "Pray out loud in a large storm", optionB: "Sing praises in a vast desert" },
  { id: "wyr4", optionA: "Memorize the book of James", optionB: "Memorize the Sermon on the Mount (Matthew 5-7)" },
  { id: "wyr5", optionA: "Go on a week-long mission trip locally", optionB: "Sponsor a child's education internationally for a year" },
];

export default function WouldYouRatherPage() {
  const [currentQuestion, setCurrentQuestion] = useState<WouldYouRatherQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getNewQuestion = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    getNewQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Would You Rather (Faith & Fun)</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Ponder interesting choices with a faith and fun twist.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 min-h-[350px] flex flex-col items-center justify-center">
          <Users className="h-16 w-16 text-primary mb-6" />
          
          {currentQuestion && !isLoading && (
            <Card className="w-full max-w-lg shadow-xl bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                  <HelpCircle className="h-5 w-5 text-accent-foreground" /> Would You Rather...
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button variant="outline" size="lg" className="w-full h-auto py-3 text-md whitespace-normal justify-start text-left hover:bg-primary/10">
                  <span className="font-semibold mr-2 text-primary">A)</span> {currentQuestion.optionA}
                </Button>
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-muted-foreground/30"></div>
                  <span className="flex-shrink mx-2 text-sm text-muted-foreground">OR</span>
                  <div className="flex-grow border-t border-muted-foreground/30"></div>
                </div>
                <Button variant="outline" size="lg" className="w-full h-auto py-3 text-md whitespace-normal justify-start text-left hover:bg-primary/10">
                  <span className="font-semibold mr-2 text-primary">B)</span> {currentQuestion.optionB}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {isLoading && <p className="text-xl text-muted-foreground">Getting a new question...</p>}
          {!currentQuestion && !isLoading && <p className="text-xl text-muted-foreground">Click below to start!</p>}


          <Button onClick={getNewQuestion} className="mt-8" disabled={isLoading}>
            <Lightbulb className="mr-2 h-4 w-4" />
            {isLoading ? "Loading..." : "Get New Question"}
          </Button>
           <p className="text-xs text-muted-foreground mt-2">Click an option to make your choice (Interaction coming soon!).</p>
        </CardContent>
      </Card>
    </div>
  );
}
