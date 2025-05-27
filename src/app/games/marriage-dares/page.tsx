
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function MarriageDaresPage() {
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
            Take on fun and faith-filled challenges with your spouse.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Zap className="h-16 w-16 text-primary" />
            <p className="text-xl text-muted-foreground">
              Interactive Marriage Dares Game Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Spin the wheel or get a random faith-based dare to complete with your partner, fostering fun and spiritual growth.
            </p>
            {/* Placeholder for spinner or dare display */}
            <Button variant="secondary" disabled className="mt-4">
              Get a Dare (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
