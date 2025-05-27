
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
import { Loader2, BookOpen, AlertTriangle, ChevronLeft, ChevronRight, Highlighter, NotebookText } from "lucide-react";
import { bibleBookList, getBook, type BibleBook } from "@/lib/bible-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  const [highlightedVerses, setHighlightedVerses] = useState<Set<number>>(new Set());
  const [chapterNotes, setChapterNotes] = useState<string>("");

  useEffect(() => {
    const book = getBook(selectedBookName);
    if (book) {
      setMaxChapters(book.chapters);
      // Reset chapter to 1 if it's invalid for the new book, or if the book changes and chapter isn't 1.
      if (selectedChapter > book.chapters || (selectedChapter !== 1 && book.name !== selectedBookName)) {
        setSelectedChapter(1);
      }
    }
  }, [selectedBookName]); // Removed selectedChapter from dependencies to avoid loop, handle in handleBookChange

  const fetchBibleChapter = async (book: string, chapter: number) => {
    setIsLoading(true);
    setError(null);
    setBibleContent(null);
    // Reset highlights and notes for the new chapter only if it's a new fetch, not for initial load if content already there
    if (bibleContent?.reference !== `${book} ${chapter}`) { // A bit simplistic check, might need refinement
        setHighlightedVerses(new Set());
        setChapterNotes("");
    }
    
    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=AMP` // Changed to AMP
      );
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (jsonError) {
          // Body wasn't JSON or other error, try to get raw text.
          try {
            const textResponse = await response.text();
            errorMsg = `HTTP error! status: ${response.status}. Response: ${textResponse.substring(0,100)}`;
          } catch (textError) {
            // Fallback if text() also fails
             errorMsg = `HTTP error! status: ${response.status}. Unable to retrieve error details.`;
          }
        }
        throw new Error(errorMsg);
      }
      const data: BibleApiResponse = await response.json();
      if (data.error) { 
        setError(data.error);
        setBibleContent(null);
      } else if (!data.verses || data.verses.length === 0) {
        setError("Chapter content not found or is empty for this translation.");
        setBibleContent(null);
      }
      else {
        setBibleContent(data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch Bible content.");
      setBibleContent(null);
      console.error("Error fetching Bible content:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookChange = (bookName: string) => {
    setSelectedBookName(bookName);
    const book = getBook(bookName);
    if (book) {
      // Reset chapter to 1 when book changes
      setSelectedChapter(1); 
      // Clear previous content and errors, notes, highlights
      setBibleContent(null); 
      setError(null);
      setHighlightedVerses(new Set());
      setChapterNotes("");
      // No automatic fetch here, user will click "Load Chapter" or it's handled by chapter change
    }
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(Number(chapter));
    // Clear previous content and errors, notes, highlights
    setBibleContent(null); 
    setError(null);
    setHighlightedVerses(new Set());
    setChapterNotes("");
    // No automatic fetch here, user will click "Load Chapter"
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (selectedBookName && selectedChapter) {
      fetchBibleChapter(selectedBookName, selectedChapter);
    }
  };
  
  const navigateChapter = (direction: 'next' | 'prev') => {
    let newChapter = selectedChapter;
    let currentBookName = selectedBookName;
    const currentBook = getBook(currentBookName);

    if (!currentBook) return; // Should not happen

    if (direction === 'next') {
      if (selectedChapter < currentBook.chapters) {
        newChapter = selectedChapter + 1;
      } else { // Move to next book, chapter 1
        const currentBookIndex = bibleBookList.findIndex(b => b.name === currentBookName);
        if (currentBookIndex < bibleBookList.length - 1) {
          const nextBook = bibleBookList[currentBookIndex + 1];
          currentBookName = nextBook.name;
          newChapter = 1;
          setSelectedBookName(nextBook.name); // Update book state
          setMaxChapters(nextBook.chapters); // Update max chapters for the new book
        } else { // Last chapter of last book, loop to first book
            const firstBook = bibleBookList[0];
            currentBookName = firstBook.name;
            newChapter = 1;
            setSelectedBookName(firstBook.name);
            setMaxChapters(firstBook.chapters);
        }
      }
    } else { // prev
      if (selectedChapter > 1) {
        newChapter = selectedChapter - 1;
      } else { // Move to previous book, last chapter
        const currentBookIndex = bibleBookList.findIndex(b => b.name === currentBookName);
        if (currentBookIndex > 0) {
          const prevBook = bibleBookList[currentBookIndex - 1];
          currentBookName = prevBook.name;
          newChapter = prevBook.chapters;
          setSelectedBookName(prevBook.name); // Update book state
          setMaxChapters(prevBook.chapters); // Update max chapters for the new book
        } else { // First chapter of first book, loop to last book
            const lastBook = bibleBookList[bibleBookList.length -1];
            currentBookName = lastBook.name;
            newChapter = lastBook.chapters;
            setSelectedBookName(lastBook.name);
            setMaxChapters(lastBook.chapters);
        }
      }
    }
    setSelectedChapter(newChapter); // Update chapter state
    fetchBibleChapter(currentBookName, newChapter);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBibleChapter(selectedBookName, selectedChapter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs only once on mount

  const toggleHighlight = (verseNumber: number) => {
    setHighlightedVerses(prevHighlights => {
      const newHighlights = new Set(prevHighlights);
      if (newHighlights.has(verseNumber)) {
        newHighlights.delete(verseNumber);
      } else {
        newHighlights.add(verseNumber);
      }
      return newHighlights;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Bible Study</CardTitle>
          <CardDescription>
            Select a book and chapter to read from the Amplified Bible. You can also highlight verses and take notes for the chapter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6">
            <div className="space-y-1.5">
              <Label htmlFor="book-select" className="text-sm font-medium">Book</Label>
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
              <Label htmlFor="chapter-select" className="text-sm font-medium">Chapter</Label>
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

          {error && !isLoading && ( // Only show error if not loading
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

          {bibleContent && !error && !isLoading && ( // Only show content if no error and not loading
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">{bibleContent.reference}</CardTitle>
                  <CardDescription>{bibleContent.translation_name || "Amplified Bible"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-1 text-foreground/90 leading-relaxed">
                      {bibleContent.verses.map((verse) => (
                        <div 
                            key={verse.verse} 
                            className={`flex items-start gap-2 py-1 rounded-md transition-colors ${highlightedVerses.has(verse.verse) ? 'bg-primary/10' : ''}`}
                        >
                            <span className="pl-1 flex-shrink-0 pt-0.5">
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                onClick={() => toggleHighlight(verse.verse)}
                                title={highlightedVerses.has(verse.verse) ? `Remove highlight from verse ${verse.verse}` : `Highlight verse ${verse.verse}`}
                                aria-pressed={highlightedVerses.has(verse.verse)}
                                >
                                <Highlighter className={`h-4 w-4 ${highlightedVerses.has(verse.verse) ? 'text-primary fill-primary/30' : 'text-muted-foreground hover:text-primary/80'}`} />
                                </Button>
                            </span>
                            <p className="flex-grow pr-1">
                                <sup className="text-xs text-primary font-semibold mr-1">{verse.verse}</sup>
                                {verse.text}
                            </p>
                        </div>
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

              <Card className="mt-6 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <NotebookText className="mr-2 h-5 w-5 text-primary" /> Chapter Notes
                  </CardTitle>
                  <CardDescription>
                    Your personal notes for {bibleContent.reference}. These are session-based and will reset if you change chapters/books.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="chapter-notes-textarea" className="sr-only">Chapter Notes for {bibleContent.reference}</Label>
                  <Textarea
                    id="chapter-notes-textarea"
                    placeholder="Type your reflections, questions, or key points here..."
                    value={chapterNotes}
                    onChange={(e) => setChapterNotes(e.target.value)}
                    rows={6}
                    className="w-full text-sm"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

