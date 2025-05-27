
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Target as TargetIcon } from "lucide-react"; // Renamed Target to TargetIcon

export default function SpiritualGrowthQuestsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Spiritual Growth Quests</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Embark on quests to grow your faith individually and as a couple.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <TargetIcon className="h-16 w-16 text-primary" />
            <p className="text-xl text-muted-foreground">
              Interactive Spiritual Growth Quests Game Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Take on mini-challenges designed to encourage spiritual disciplines, track your progress, and perhaps earn badges.
            </p>
            {/* Placeholder for quest list or progress display */}
            <Button variant="secondary" disabled className="mt-4">
              View Quests (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
