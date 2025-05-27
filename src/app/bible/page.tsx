
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, BookOpen, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { bibleBookList, getBook, type BibleBook } from "@/lib/bible-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleApiResponse {
  reference: string;
  verses: BibleVerse[];
  text: string; // Full text of the chapter
  translation_id: string;
  translation_name: string;
  translation_note: string;
  error?: string; // For API specific errors
}

export default function BiblePage() {
  const [selectedBookName, setSelectedBookName] = useState<string>(bibleBookList[0].name);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [maxChapters, setMaxChapters] = useState<number>(bibleBookList[0].chapters);
  
  const [bibleContent, setBibleContent] = useState<BibleApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const book = getBook(selectedBookName);
    if (book) {
      setMaxChapters(book.chapters);
      // Reset chapter to 1 if current chapter exceeds new max, or if it's not the default "1"
      if (selectedChapter > book.chapters || (selectedChapter !== 1 && book.name !== selectedBookName)) {
        setSelectedChapter(1);
      }
    }
  }, [selectedBookName, selectedChapter]);


  const fetchBibleChapter = async (book: string, chapter: number) => {
    setIsLoading(true);
    setError(null);
    setBibleContent(null);
    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: BibleApiResponse = await response.json();
      if (data.error) { // Some APIs might return 200 OK with an error in the body
        setError(data.error);
      } else {
        setBibleContent(data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch Bible content.");
      console.error("Error fetching Bible content:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookChange = (bookName: string) => {
    setSelectedBookName(bookName);
    const book = getBook(bookName);
    if (book) {
      setSelectedChapter(1); // Reset to chapter 1 when book changes
      setBibleContent(null); // Clear previous content
      setError(null); // Clear previous error
    }
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(Number(chapter));
    setBibleContent(null); // Clear previous content
    setError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (selectedBookName && selectedChapter) {
      fetchBibleChapter(selectedBookName, selectedChapter);
    }
  };
  
  const navigateChapter = (direction: 'next' | 'prev') => {
    let newChapter = selectedChapter;
    if (direction === 'next') {
      newChapter = selectedChapter < maxChapters ? selectedChapter + 1 : 1; // Loop to first chapter
    } else {
      newChapter = selectedChapter > 1 ? selectedChapter - 1 : maxChapters; // Loop to last chapter
    }
    setSelectedChapter(newChapter);
    fetchBibleChapter(selectedBookName, newChapter);
  };

  // Automatically fetch Genesis 1 on initial load
  useEffect(() => {
    fetchBibleChapter(bibleBookList[0].name, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Bible Study</CardTitle>
          <CardDescription>
            Select a book and chapter to read from the King James Version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6">
            <div className="space-y-1.5">
              <label htmlFor="book-select" className="text-sm font-medium">Book</label>
              <Select value={selectedBookName} onValueChange={handleBookChange}>
                <SelectTrigger id="book-select">
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {bibleBookList.map((book) => (
                    <SelectItem key={book.name} value={book.name}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="chapter-select" className="text-sm font-medium">Chapter</label>
              <Select
                value={selectedChapter.toString()}
                onValueChange={handleChapterChange}
                disabled={!selectedBookName}
              >
                <SelectTrigger id="chapter-select">
                  <SelectValue placeholder="Select a chapter" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map(
                    (chapNum) => (
                      <SelectItem key={chapNum} value={chapNum.toString()}>
                        {chapNum}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" disabled={isLoading || !selectedBookName || !selectedChapter} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="mr-2 h-4 w-4" />
              )}
              Load Chapter
            </Button>
          </form>
          
          <Separator className="my-6" />

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Loading chapter...</p>
            </div>
          )}

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="p-4">
                <div className="flex items-center text-destructive">
                  <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error loading content</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {bibleContent && !error && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">{bibleContent.reference}</CardTitle>
                <CardDescription>King James Version</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3 text-foreground/90 leading-relaxed">
                    {bibleContent.verses.map((verse) => (
                       <p key={verse.verse}>
                        <sup className="text-xs text-primary font-semibold mr-1">{verse.verse}</sup>
                        {verse.text}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => navigateChapter('prev')} disabled={isLoading}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Chapter {selectedChapter} of {maxChapters}
                </p>
                <Button variant="outline" onClick={() => navigateChapter('next')} disabled={isLoading}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
