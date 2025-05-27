
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MessageSquareHeart } from "lucide-react"; // Added MessageSquareHeart icon

export default function ConnectionCardsPage() {
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
            Spark meaningful conversations with your partner.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <MessageSquareHeart className="h-16 w-16 text-primary" />
            <p className="text-xl text-muted-foreground">
              Interactive Connection Cards Game Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Draw digital cards with questions designed to deepen your connection and understanding.
            </p>
            {/* Placeholder for draw card button or card display area */}
            <Button variant="secondary" disabled className="mt-4">
              Draw a Card (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
