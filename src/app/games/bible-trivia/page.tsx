
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react"; // Added Brain icon

export default function BibleTriviaPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Bible Trivia Challenge</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Test your knowledge of the Bible! Select a mode and start the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Brain className="h-16 w-16 text-primary" />
            <p className="text-xl text-muted-foreground">
              Interactive Bible Trivia Game Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Prepare to test your biblical knowledge with various quiz modes and difficulty levels.
            </p>
            {/* Placeholder for game mode selection or start button */}
            <Button variant="secondary" disabled className="mt-4">
              Start Challenge (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
