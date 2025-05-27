
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default function WouldYouRatherPage() {
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
            Make interesting choices with a faith and fun twist.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Users className="h-16 w-16 text-primary" />
            <p className="text-xl text-muted-foreground">
              Interactive Would You Rather Game Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Get ready for thought-provoking and entertaining "Would You Rather" questions with a unique faith or fun perspective.
            </p>
            {/* Placeholder for question display and choice buttons */}
            <Button variant="secondary" disabled className="mt-4">
              Get Question (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
