
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckSquare, Shuffle } from "lucide-react";
import { useState, useEffect } from "react";

interface VerseSnippet {
  id: string;
  text: string;
  book: string; // Correct book for matching
}

interface BookOption {
  id: string;
  name: string;
}

const sampleSnippets: VerseSnippet[] = [
  { id: "v1", text: "For God so loved the world...", book: "John" },
  { id: "v2", text: "The Lord is my shepherd; I shall not want.", book: "Psalms" },
  { id: "v3", text: "I can do all things through Christ who strengthens me.", book: "Philippians" },
];

const sampleBooks: BookOption[] = [
  { id: "b1", name: "John" },
  { id: "b2", name: "Psalms" },
  { id: "b3", name: "Philippians" },
  { id: "b4", name: "Genesis" }, // Extra option
];

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};


export default function VerseMatchPage() {
  const [shuffledSnippets, setShuffledSnippets] = useState<VerseSnippet[]>([]);
  const [shuffledBooks, setShuffledBooks] = useState<BookOption[]>([]);

  useEffect(() => {
    setShuffledSnippets(shuffleArray(sampleSnippets));
    setShuffledBooks(shuffleArray(sampleBooks));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Verse Match Challenge</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Match the Bible verse snippets to their correct books. (Interactive matching coming soon!)
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Verse Snippets Column */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center text-primary mb-2">Verse Snippets</h3>
              {shuffledSnippets.map((snippet) => (
                <Card key={snippet.id} className="p-3 bg-secondary/30 shadow-sm cursor-grab active:cursor-grabbing">
                  <p className="text-sm text-foreground/90">"{snippet.text}"</p>
                </Card>
              ))}
            </div>

            {/* Book Options Column */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center text-primary mb-2">Book Options</h3>
              {shuffledBooks.map((book) => (
                <Card key={book.id} className="p-3 bg-muted/40 shadow-sm cursor-pointer hover:bg-muted/70">
                  <p className="text-sm font-medium text-center text-foreground/80">{book.name}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" disabled>
              <Shuffle className="mr-2 h-4 w-4" />
              Check Matches (Soon)
            </Button>
             <p className="text-xs text-muted-foreground mt-2">Drag and drop functionality will be added to match verses to books.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
