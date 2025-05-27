
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Zap, Gift, HeartHandshake } from "lucide-react";

const dares: string[] = [
  "Pray together for 10 minutes tonight about your week.",
  "Plan a surprise small act of service for your spouse this week.",
  "Read a chapter of Proverbs together and discuss one insight you each gained.",
  "Share one thing you admire about your spouse's faith journey.",
  "Write a short note of encouragement and hide it for your spouse to find.",
  "Go on a 15-minute walk together and talk about your favorite Bible verse.",
  "Compliment your spouse three times today, focusing on their character.",
];

export default function MarriageDaresPage() {
  const [currentDare, setCurrentDare] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getNewDare = () => {
    setIsLoading(true);
    // Simulate a slight delay for effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * dares.length);
      setCurrentDare(dares[randomIndex]);
      setIsLoading(false);
    }, 500);
  };
  
  // Get an initial dare on mount
  useEffect(() => {
    getNewDare();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Marriage Dares (Faith Edition)</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Take on fun and faith-filled challenges with your spouse. Get a dare!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 min-h-[300px] flex flex-col items-center justify-center">
          <Zap className="h-16 w-16 text-primary mb-6" />
          
          {currentDare && !isLoading ? (
            <Card className="w-full max-w-md shadow-xl bg-secondary/50">
              <CardHeader>
                  <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5 text-accent-foreground" /> Your Dare:
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-foreground/90 leading-relaxed">
                  {currentDare}
                </p>
              </CardContent>
            </Card>
          ) : isLoading ? (
             <p className="text-xl text-muted-foreground">Getting your dare...</p>
          ) : (
            <p className="text-xl text-muted-foreground">
              Click "Get a New Dare" to start!
            </p>
          )}

          <Button onClick={getNewDare} className="mt-8" disabled={isLoading}>
            <HeartHandshake className="mr-2 h-4 w-4" />
            {isLoading ? "Getting Dare..." : "Get a New Dare"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
