
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VerseMatchPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Verse Match</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Match Bible verses to their references or complete them.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-xl text-muted-foreground">Interactive Verse Match Game Coming Soon!</p>
          {/* Placeholder for game UI */}
        </CardContent>
      </Card>
    </div>
  );
}
