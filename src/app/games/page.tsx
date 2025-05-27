
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GameGeneratorForm } from "./game-generator-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Gamepad2, Users, HelpCircle, Target as TargetIcon, CheckSquare, MessageSquare, Zap } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface GameOption {
  id: string;
  title: string;
  description: string;
  detailsTitle?: string;
  details: string[];
  exampleTitle?: string;
  examples: string[] | string;
  icon: React.ElementType;
}

const predefinedGames: GameOption[] = [
  {
    id: "bible-trivia",
    title: "Bible Trivia Challenge",
    description: "Timed quizzes or competitive Bible knowledge games.",
    detailsTitle: "Modes",
    details: ["Solo", "Couple-vs-Couple", "Team Play"],
    exampleTitle: "Example Questions",
    examples: [
      "Who was the first couple in the Bible?",
      "Finish the verse: ‘Love is patient, love is…’",
    ],
    icon: HelpCircle,
  },
  {
    id: "connection-cards",
    title: "Couple Connection Cards",
    description: "Digital cards with thought-provoking or fun questions to spark conversation.",
    detailsTitle: "Categories",
    details: ["Faith", "Childhood Memories", "Goals", "Love Language", "etc."],
    exampleTitle: "Gameplay",
    examples: "Take turns drawing a card and answering/discussing.",
    icon: MessageSquare,
  },
  {
    id: "verse-match",
    title: "Verse Match",
    description: "Match verses to their book, complete the verse, or match themes to scriptures.",
    detailsTitle: "Format",
    details: ["Drag and drop", "Multiple choice", "Flashcards"],
    icon: CheckSquare,
  },
  {
    id: "marriage-dares",
    title: "Marriage Dares (Faith Edition)",
    description: "A spinner or randomizer assigns faith-based challenges for couples.",
    detailsTitle: "Example Dares",
    details: [
        "Pray together for 10 minutes tonight.",
        "Plan a surprise note or gesture for your spouse this week.",
        "Read a chapter of Proverbs together and discuss one insight.",
    ],
    icon: Zap,
  },
  {
    id: "would-you-rather",
    title: "Would You Rather (Faith & Fun)",
    description: "Light-hearted or deep \"Would You Rather\" questions with a faith or fun twist.",
    detailsTitle: "Example Questions",
    details: [
      "Would you rather pray in a storm or sing in a desert?",
      "Would you rather have dinner with Esther or Ruth?",
      "Would you rather lead a small group or write a devotional?",
    ],
    icon: Users,
  },
  {
    id: "spiritual-growth-quests",
    title: "Spiritual Growth Quests",
    description: "Mini challenges designed to encourage spiritual disciplines and growth, potentially unlocking badges or recognition.",
    detailsTitle: "Example Quests",
    details: [
      "Read 3 devotionals this week.",
      "Fast as a couple for one meal or day.",
      "Share a testimony or a recent spiritual insight with the group.",
      "Memorize a new Bible verse together.",
    ],
    icon: TargetIcon,
  },
];


export default function GamesPage() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const selectedGame = predefinedGames.find(game => game.id === selectedGameId);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Fun & Games</CardTitle>
          <CardDescription>
            Spark joy and connection! Generate a unique group game with AI or explore ideas for your next gathering.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Group Game Generator */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">AI Group Game Generator</CardTitle>
            </div>
            <CardDescription>
              Select a mood and let our AI suggest a unique faith-based game for your group.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <GameGeneratorForm />
          </CardContent>
        </Card>

        {/* Card 2: Explore & Play Games */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">Explore Game Ideas</CardTitle>
            </div>
            <CardDescription>
              Select a game from the list below to see its description and how to play.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4">
            <div>
              <Label htmlFor="game-select" className="text-sm font-medium">Select a Game</Label>
              <Select onValueChange={setSelectedGameId} value={selectedGameId || ""}>
                <SelectTrigger id="game-select" className="mt-1">
                  <SelectValue placeholder="Choose a game to explore..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      <div className="flex items-center gap-2">
                        <game.icon className="h-4 w-4 text-muted-foreground" />
                        {game.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGame && (
              <div className="mt-4 pt-4 border-t space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <selectedGame.icon className="h-5 w-5" />
                  {selectedGame.title}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedGame.description}</p>
                
                {selectedGame.detailsTitle && (
                  <div>
                    <h4 className="text-md font-medium text-foreground mb-1">{selectedGame.detailsTitle}:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5 pl-4">
                      {selectedGame.details.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedGame.exampleTitle && selectedGame.examples && (
                  <div>
                    <h4 className="text-md font-medium text-foreground mb-1">{selectedGame.exampleTitle}:</h4>
                    {Array.isArray(selectedGame.examples) ? (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5 pl-4">
                        {selectedGame.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">{selectedGame.examples}</p>
                    )}
                  </div>
                )}
              </div>
            )}
             {!selectedGame && selectedGameId && (
                 <p className="text-sm text-muted-foreground text-center pt-6">Game details not found. Please select another game.</p>
             )}
             {!selectedGameId && (
                 <p className="text-sm text-muted-foreground text-center pt-6">(Select a game from the dropdown to see its details)</p>
             )}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">More interactive gameplays coming soon!</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
