
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Gamepad2, Users, HelpCircle, CheckSquare, Zap, Play, Target as TargetIcon, MessageSquare, ArrowRight } from "lucide-react"; 
import { useState } from "react";
import { useRouter } from 'next/navigation';
// import { useToast } from "@/hooks/use-toast"; // No longer needed here for play game button

interface GameOption {
  id: string;
  title: string;
  description: string;
  detailsTitle?: string;
  details: string[];
  exampleTitle?: string;
  examples?: string[] | string; 
  icon: React.ElementType;
}

// Define icon aliases before they are used in predefinedGames
const Brain = HelpCircle; 
const MessageSquareHeart = MessageSquare; 

const predefinedGames: GameOption[] = [
  {
    id: "bible-trivia",
    title: "Bible Trivia Challenge",
    description: "Timed quizzes or competitive Bible knowledge games.",
    detailsTitle: "Test Your Knowledge",
    details: ["Covers Old & New Testaments", "Various difficulty levels (soon)", "Track your high scores (soon)"],
    icon: Brain, 
  },
  {
    id: "connection-cards",
    title: "Couple Connection Cards",
    description: "Digital cards with thought-provoking or fun questions to spark conversation.",
    detailsTitle: "Deepen Your Bond",
    details: ["Categories: Faith, Dreams, Fun Facts", "Take turns drawing and discussing", "Promotes open communication"],
    icon: MessageSquareHeart, 
  },
  {
    id: "verse-match",
    title: "Verse Match Challenge",
    description: "Match verses to their book, complete the verse, or match themes to scriptures.",
    detailsTitle: "Sharpen Your Scripture Memory",
    details: ["Match verse snippets to books", "Fill-in-the-blank verses (soon)", "Theme-based matching (soon)"],
    icon: CheckSquare,
  },
  {
    id: "marriage-dares",
    title: "Marriage Dares (Faith Edition)",
    description: "A spinner or randomizer assigns faith-based challenges for couples.",
    detailsTitle: "Fun & Faith-Filled Challenges",
    details: [
        "Complete dares to strengthen your bond.",
        "Focuses on prayer, service, and fun.",
        "New dares added regularly (soon).",
    ],
    icon: Zap,
  },
  {
    id: "would-you-rather",
    title: "Would You Rather (Faith & Fun)",
    description: "Light-hearted or deep \"Would You Rather\" questions with a faith or fun twist.",
    detailsTitle: "Thought-Provoking Choices",
    details: [
      "Discuss your choices as a couple/group.",
      "Explores faith perspectives and preferences.",
      "Great for icebreakers or deeper talks.",
    ],
    icon: Users,
  },
  {
    id: "spiritual-growth-quests",
    title: "Spiritual Growth Quests",
    description: "Mini challenges designed to encourage spiritual disciplines and growth, potentially unlocking badges or recognition.",
    detailsTitle: "Embark on Faith Adventures",
    details: [
      "Complete quests individually or as a couple.",
      "Focus on prayer, study, and service.",
      "Track progress and earn achievements (soon).",
    ],
    icon: TargetIcon,
  },
];

const moods = ["Fun", "Deep", "Spiritual", "Icebreaker", "Challenge", "Trivia"] as const;


export default function GamesPage() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedMoodForGenerator, setSelectedMoodForGenerator] = useState<string>(moods[0]);
  const router = useRouter();
  // const { toast } = useToast(); // No longer needed here

  const selectedGame = predefinedGames.find(game => game.id === selectedGameId);

  const handlePlayGame = () => {
    if (selectedGame) {
      router.push(`/games/${selectedGame.id}`);
    }
  };

  const handleGetGroupGameIdea = () => {
    if (selectedMoodForGenerator) {
      router.push(`/games/group-game-generator?mood=${selectedMoodForGenerator}`);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Fun &amp; Games</CardTitle>
          <CardDescription>
            Spark joy and connection! Generate unique group game ideas with AI or explore and play our selection of games.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Group Game Ideas (New Navigation) */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">Group Game Ideas</CardTitle>
            </div>
            <CardDescription>
              Select a mood and get a unique faith-based game idea for your group, complete with instructions and benefits.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div>
              <Label htmlFor="mood-select-nav" className="text-sm font-medium">Select a Mood</Label>
              <Select onValueChange={setSelectedMoodForGenerator} defaultValue={selectedMoodForGenerator}>
                <SelectTrigger id="mood-select-nav" className="mt-1">
                  <SelectValue placeholder="Choose a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGetGroupGameIdea} className="w-full" disabled={!selectedMoodForGenerator}>
              Get Group Game Idea <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Generates one game idea on a new page.</p>
          </CardFooter>
        </Card>

        {/* Card 2: Explore Game Ideas */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">Explore & Play Games</CardTitle>
            </div>
            <CardDescription>
              Select a game from the list below to see its description and launch it.
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
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <selectedGame.icon className="h-5 w-5" />
                    {selectedGame.title}
                    </h3>
                    <Button onClick={handlePlayGame} size="sm" disabled={!selectedGame}>
                        <Play className="mr-2 h-4 w-4" />
                        Play Game
                    </Button>
                </div>
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
            <p className="text-xs text-muted-foreground">Select a game and click "Play Game" to navigate to its page.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

    