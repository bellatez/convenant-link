
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MessageSquareHeart, RefreshCw } from "lucide-react";

const connectionQuestions: string[] = [
  "What's one thing you're grateful for in our relationship today?",
  "If we could go anywhere in the world for a week, where would you want to go and why?",
  "What's a small act of kindness I've done recently that you appreciated?",
  "Share a favorite memory of us from the past year.",
  "What's one spiritual goal you have for yourself or for us as a couple?",
  "If you could describe our love in three words, what would they be?",
  "What's something new you've learned about me recently?",
  "How can I pray for you this week?",
  "What's one dream you have for our future together?",
  "Describe a moment when you felt particularly close to God because of something we experienced together."
];

export default function ConnectionCardsPage() {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [drawnQuestions, setDrawnQuestions] = useState<Set<string>>(new Set());

  const drawNewCard = () => {
    let availableQuestions = connectionQuestions.filter(q => !drawnQuestions.has(q));

    if (availableQuestions.length === 0) {
      // All questions drawn, reset
      setDrawnQuestions(new Set());
      availableQuestions = [...connectionQuestions];
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const newQuestion = availableQuestions[randomIndex];
    
    setCurrentQuestion(newQuestion);
    setDrawnQuestions(prevDrawn => new Set(prevDrawn).add(newQuestion));
  };

  // Draw an initial card on component mount
  useState(() => {
    // This is a bit of a hack to call drawNewCard on mount for useState initializer
    // In a more complex scenario, useEffect would be better, but this avoids hydration issues with initial random.
    if (!currentQuestion) {
        const initialRandomIndex = Math.floor(Math.random() * connectionQuestions.length);
        const initialQuestion = connectionQuestions[initialRandomIndex];
        setCurrentQuestion(initialQuestion);
        setDrawnQuestions(new Set<string>().add(initialQuestion));
    }
  });


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Couple Connection Cards</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Spark meaningful conversations with your partner. Draw a card!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 min-h-[300px] flex flex-col items-center justify-center">
          <MessageSquareHeart className="h-16 w-16 text-primary mb-6" />
          
          {currentQuestion ? (
            <Card className="w-full max-w-md shadow-xl bg-secondary/50">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-foreground/90 leading-relaxed">
                  {currentQuestion}
                </p>
              </CardContent>
            </Card>
          ) : (
            <p className="text-xl text-muted-foreground">
              Click "Draw a Card" to start!
            </p>
          )}

          <Button onClick={drawNewCard} className="mt-8">
            <RefreshCw className="mr-2 h-4 w-4" />
            {drawnQuestions.size === connectionQuestions.length ? "Start Over" : "Draw Another Card"}
          </Button>
           {drawnQuestions.size === connectionQuestions.length && (
            <p className="text-xs text-muted-foreground mt-2">You've seen all the cards! Click "Start Over" to reshuffle.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
