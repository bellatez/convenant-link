
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Target as TargetIcon, CheckSquare, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";


interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ElementType;
}

const initialQuests: Quest[] = [
  { id: "q1", title: "Read 3 Devotionals", description: "Spend time in God's word with guided devotionals this week.", completed: false, icon: BookOpenText },
  { id: "q2", title: "Prayer Walk", description: "Go for a 15-minute walk and pray for your neighborhood or specific concerns.", completed: false, icon: Footprints },
  { id: "q3", title: "Memorize a Verse", description: "Choose a Bible verse and commit it to memory as a couple.", completed: false, icon: Brain },
  { id: "q4", title: "Serve Someone", description: "Find a small way to serve someone in your community or church this week.", completed: false, icon: HandHeart },
  { id: "q5", title: "Gratitude Journaling", description: "Each list three things you're grateful for today and share with each other.", completed: false, icon: Edit3 },
];
// Temporary icons, replace with actual lucide icons if needed
const BookOpenText = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const Footprints = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 16v-2.38c0-.9.6-1.72 1.48-1.93l3.54-.89c.94-.23 1.48-.73 1.48-1.5V7.5c0-.83-.54-1.5-1.48-1.5H4.5c-.83 0-1.5.67-1.5 1.5v10.88c0 .9.6 1.72 1.48 1.93l3.54.89c.94.23 1.48.73 1.48 1.5V20M10.5 20v-2.38c0-.9.6-1.72 1.48-1.93l3.54-.89c.94-.23 1.48-.73 1.48-1.5V11c0-.83-.54-1.5-1.48-1.5h-4.04c-.83 0-1.5.67-1.5 1.5v10.88c0 .9.6 1.72 1.48 1.93l3.54.89c.94.23 1.48.73 1.48 1.5V20"/></svg>;
const Brain = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a2.83 2.83 0 0 0-2.04 2.03l-1.41 5.62a2 2 0 0 1-1.95 1.41H2.5a2 2 0 0 0-2 2.04L1 15.5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2.04a2 2 0 0 0-2.04-2h-4.09a2 2 0 0 1-1.95-1.41l-1.41-5.62A2.83 2.83 0 0 0 12 2Z"/><path d="M10 14a3.5 3.5 0 0 0 4 0"/><path d="M10 17.5c0 2.5 2 2.5 2 2.5s2 0 2-2.5"/><path d="M4 10.5a1 1 0 0 1-1-1"/><path d="M21 9.5a1 1 0 0 1-1 1"/></svg>;
const HandHeart = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 .6-.6a2 2 0 0 1 2.8 0L7 16"/><path d="M19 13V7a2 2 0 0 0-2-2H8.5L5 7.5V11"/><path d="M14 18v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0Z"/></svg>;
const Edit3 = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;


export default function SpiritualGrowthQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completedQuests = quests.filter(q => q.completed).length;
    setProgress((completedQuests / quests.length) * 100);
  }, [quests]);

  const toggleQuest = (questId: string) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId ? { ...quest, completed: !quest.completed } : quest
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Spiritual Growth Quests</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Embark on these mini-challenges to grow your faith individually and as a couple. Track your progress!
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
                <Label className="text-sm font-medium text-muted-foreground">Overall Quest Progress</Label>
                <span className="text-sm font-semibold text-primary">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} aria-label="Overall quest progress" />
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <Card key={quest.id} className={`p-4 transition-all ${quest.completed ? 'bg-green-50 border-green-200' : 'bg-card'}`}>
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={quest.id}
                    checked={quest.completed}
                    onCheckedChange={() => toggleQuest(quest.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={quest.id} className={`text-lg font-semibold flex items-center gap-2 ${quest.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                       <quest.icon className={`h-5 w-5 ${quest.completed ? 'text-green-600' : 'text-primary' }`} />
                       {quest.title}
                    </Label>
                    <p className={`text-sm mt-0.5 ${quest.completed ? 'text-muted-foreground/80' : 'text-foreground/80'}`}>
                      {quest.description}
                    </p>
                  </div>
                  {quest.completed && <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />}
                </div>
              </Card>
            ))}
          </div>
           <p className="text-xs text-muted-foreground mt-8 text-center">More quests and badge unlocking features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
