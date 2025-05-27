
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GameGeneratorForm } from "./game-generator-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function GamesPage() {
  const [gameQuery, setGameQuery] = useState("");
  const { toast } = useToast();

  const handleGetGameIdeas = () => {
    if (!gameQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Enter a game type",
        description: "Please tell us what kind of game you're looking for.",
      });
      return;
    }
    // Placeholder for future AI call
    console.log("User is looking for games related to:", gameQuery);
    toast({
      title: "Coming Soon!",
      description: `We'll find games related to: "${gameQuery}" in a future update.`,
    });
    // Here you would eventually call a Genkit flow with gameQuery
    // and display the results.
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Fun & Games</CardTitle>
          <CardDescription>
            Spark joy and connection! Generate a unique group game with AI or explore ideas for your next gathering.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Group Game Generator */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">AI Group Game Generator</CardTitle>
            </div>
            <CardDescription>
              Select a mood and let our AI suggest a unique faith-based game for your group.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <GameGeneratorForm />
          </CardContent>
        </Card>

        {/* Card 2: Explore & Play Games */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">Explore & Play Games</CardTitle>
            </div>
            <CardDescription>
              Tell us what kind of game you're in the mood for, and we'll find some options!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4">
            <div>
              <label htmlFor="game-query-input" className="text-sm font-medium text-muted-foreground">
                What kind of game are you looking for?
              </label>
              <Input
                id="game-query-input"
                placeholder="E.g., 'Bible trivia for adults', 'Quick icebreaker for 10 people'"
                value={gameQuery}
                onChange={(e) => setGameQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleGetGameIdeas} className="w-full">
              Get Game Ideas
            </Button>
            {/* This is where proposed games would appear later */}
            <div className="mt-4 text-center flex-grow flex items-center justify-center">
                 <p className="text-sm text-muted-foreground">(Game proposals based on your input will appear here soon)</p>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Interactive game suggestions are under development.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
