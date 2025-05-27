
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, BookOpen, AlertTriangle, ChevronLeft, ChevronRight, Highlighter, StickyNote } from "lucide-react";
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
  const [verseNotes, setVerseNotes] = useState<Map<number, string>>(new Map());
  
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [currentEditingVerse, setCurrentEditingVerse] = useState<{ book: string; chapter: number; verseNumber: number; verseText: string } | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState("");

  useEffect(() => {
    const book = getBook(selectedBookName);
    if (book) {
      setMaxChapters(book.chapters);
      if (selectedChapter > book.chapters || (selectedChapter !== 1 && book.name !== selectedBookName)) {
        setSelectedChapter(1);
      }
    }
  }, [selectedBookName]);

  const fetchBibleChapter = async (book: string, chapter: number) => {
    setIsLoading(true);
    setError(null);
    setBibleContent(null);
    
    if (bibleContent?.reference !== `${book} ${chapter}`) { 
        setHighlightedVerses(new Set());
        setVerseNotes(new Map()); // Reset verse-specific notes
    }
    
    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv` 
      );
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (jsonError) {
          try {
            const textResponse = await response.text();
            errorMsg = `HTTP error! status: ${response.status}. Response: ${textResponse.substring(0,100)}`;
          } catch (textError) {
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
      setSelectedChapter(1); 
      setBibleContent(null); 
      setError(null);
      setHighlightedVerses(new Set());
      setVerseNotes(new Map());
    }
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(Number(chapter));
    setBibleContent(null); 
    setError(null);
    setHighlightedVerses(new Set());
    setVerseNotes(new Map());
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

    if (!currentBook) return; 

    if (direction === 'next') {
      if (selectedChapter < currentBook.chapters) {
        newChapter = selectedChapter + 1;
      } else { 
        const currentBookIndex = bibleBookList.findIndex(b => b.name === currentBookName);
        if (currentBookIndex < bibleBookList.length - 1) {
          const nextBook = bibleBookList[currentBookIndex + 1];
          currentBookName = nextBook.name;
          newChapter = 1;
          setSelectedBookName(nextBook.name); 
          setMaxChapters(nextBook.chapters); 
        } else { 
            const firstBook = bibleBookList[0];
            currentBookName = firstBook.name;
            newChapter = 1;
            setSelectedBookName(firstBook.name);
            setMaxChapters(firstBook.chapters);
        }
      }
    } else { 
      if (selectedChapter > 1) {
        newChapter = selectedChapter - 1;
      } else { 
        const currentBookIndex = bibleBookList.findIndex(b => b.name === currentBookName);
        if (currentBookIndex > 0) {
          const prevBook = bibleBookList[currentBookIndex - 1];
          currentBookName = prevBook.name;
          newChapter = prevBook.chapters;
          setSelectedBookName(prevBook.name); 
          setMaxChapters(prevBook.chapters); 
        } else { 
            const lastBook = bibleBookList[bibleBookList.length -1];
            currentBookName = lastBook.name;
            newChapter = lastBook.chapters;
            setSelectedBookName(lastBook.name);
            setMaxChapters(lastBook.chapters);
        }
      }
    }
    setSelectedChapter(newChapter); 
    fetchBibleChapter(currentBookName, newChapter);
  };

  useEffect(() => {
    fetchBibleChapter(selectedBookName, selectedChapter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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

  const openNoteDialog = (verse: BibleVerse) => {
    if (!bibleContent) return;
    setCurrentEditingVerse({
      book: bibleContent.verses[0].book_name, // Assuming all verses in content are from same book/chap
      chapter: bibleContent.verses[0].chapter,
      verseNumber: verse.verse,
      verseText: verse.text
    });
    setCurrentNoteText(verseNotes.get(verse.verse) || "");
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (currentEditingVerse) {
      setVerseNotes(prevNotes => new Map(prevNotes).set(currentEditingVerse.verseNumber, currentNoteText));
    }
    setIsNoteDialogOpen(false);
    setCurrentEditingVerse(null);
    setCurrentNoteText("");
  };

  const handleCloseNoteDialog = () => {
    setIsNoteDialogOpen(false);
    setCurrentEditingVerse(null);
    setCurrentNoteText("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Bible Study</CardTitle>
          <CardDescription>
            Select a book and chapter to read from the King James Version (KJV). You can highlight verses and click a verse to add/edit personal notes.
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

          {error && !isLoading && ( 
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

          {bibleContent && !error && !isLoading && ( 
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">{bibleContent.reference}</CardTitle>
                  <CardDescription>{bibleContent.translation_name || "King James Version"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-1 text-foreground/90 leading-relaxed">
                      {bibleContent.verses.map((verse) => (
                        <div 
                            key={verse.verse} 
                            className={`flex items-start gap-2 py-1 rounded-md transition-colors ${highlightedVerses.has(verse.verse) ? 'bg-primary/10' : ''}`}
                        >
                            <span className="pl-1 flex-shrink-0 pt-0.5 space-x-1">
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
                                {verseNotes.has(verse.verse) && (
                                    <StickyNote className="h-4 w-4 text-accent-foreground inline-block" title="This verse has a note" />
                                )}
                            </span>
                            <p 
                              className="flex-grow pr-1 cursor-pointer hover:bg-secondary/30 rounded px-1"
                              onClick={() => openNoteDialog(verse)}
                              title={`Click to add/edit note for verse ${verse.verse}`}
                            >
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
            </>
          )}
        </CardContent>
      </Card>

      {currentEditingVerse && (
        <Dialog open={isNoteDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseNoteDialog();
            else setIsNoteDialogOpen(true);
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Note for {currentEditingVerse.book} {currentEditingVerse.chapter}:{currentEditingVerse.verseNumber}</DialogTitle>
              <DialogDescription className="pt-2 text-sm text-muted-foreground italic">
                "{currentEditingVerse.verseText}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="note-textarea" className="sr-only">
                Note
              </Label>
              <Textarea
                id="note-textarea"
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Type your note here..."
                rows={5}
                className="text-sm"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseNoteDialog}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
