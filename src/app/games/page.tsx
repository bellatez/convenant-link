
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameGeneratorForm } from "./game-generator-form";
import { Palette, MessagesSquare, Shuffle, SmilePlus, Lightbulb } from "lucide-react"; // Added more icons

const suggestedGames = [
  {
    icon: Palette,
    title: "Bible Charades or Pictionary",
    description: "Act out or draw Bible stories, characters, concepts, or verses. A fun way to engage with scripture creatively.",
  },
  {
    icon: MessagesSquare,
    title: "Two Truths and a Testimony",
    description: "Each person shares two true statements about their faith journey and one 'testimony' (a significant faith experience, or a made-up one for a fun twist). Others guess the real testimony.",
  },
  {
    icon: Shuffle,
    title: "Verse Scramble",
    description: "Write familiar Bible verses on strips of paper, cut them into phrases or words, and have individuals or teams race to reassemble them correctly.",
  },
  {
    icon: SmilePlus,
    title: "Gratitude Go-Around",
    description: "Go around the group, and each person shares something they are grateful for, possibly relating it to a recent blessing, answered prayer, or a quality of God.",
  },
  {
    icon: Lightbulb,
    title: "Story Chain (Faith Edition)",
    description: "Start a story with a faith-based prompt (e.g., 'Once, a small act of kindness led to...'). Each person adds a sentence to continue the story, building a collaborative narrative.",
  }
];

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Fun & Games</CardTitle>
          <CardDescription>
            Explore AI-generated game ideas or pick from classic faith-based games to spark joy and connection.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="generate">Generate Group Game</TabsTrigger>
          <TabsTrigger value="suggestions">Game Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>AI Group Game Generator</CardTitle>
              <CardDescription>
                Select a mood and let our AI suggest a unique faith-based game for your group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GameGeneratorForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Game Night Classics</CardTitle>
              <CardDescription>
                A few tried-and-true game ideas to inspire your next gathering. Adapt them with faith-based themes!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedGames.map((game, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <game.icon className="h-6 w-6 text-primary flex-shrink-0" />
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
