
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, HelpCircle, Users, RefreshCw } from "lucide-react"; // Added RefreshCw
import { useToast } from "@/hooks/use-toast";
import { generateChristianCoupleGame, type GenerateChristianCoupleGameOutput, type GenerateChristianCoupleGameInput } from "@/ai/flows/generate-christian-couple-game";
import { Separator } from "@/components/ui/separator";

const moods = ["Fun", "Deep", "Spiritual", "Icebreaker", "Challenge", "Trivia"] as const;
type MoodEnum = typeof moods[number];

const formSchema = z.object({
  mood: z.enum(moods, { required_error: "Please select a mood." }),
});

type FormValues = z.infer<typeof formSchema>;

interface GameGeneratorFormProps {
  initialMood?: MoodEnum;
  onMoodChange?: (mood: MoodEnum) => void; // Optional: To update URL if mood changes on detail page
}

export function GameGeneratorForm({ initialMood, onMoodChange }: GameGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GenerateChristianCoupleGameOutput | null>(null);
  const [currentFormMood, setCurrentFormMood] = useState<MoodEnum>(initialMood || moods[0]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: initialMood || moods[0],
    },
  });

  const fetchGame = async (mood: MoodEnum) => {
    setIsLoading(true);
    setGeneratedGame(null);
    try {
      const result = await generateChristianCoupleGame({ mood });
      setGeneratedGame(result);
      if (!result || !result.name) {
         toast({
          variant: "default",
          title: "No Game Generated",
          description: `The generator couldn't come up with a game for "${mood}" this time. Try a different mood or try again!`,
        });
      }
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Game",
        description: "Could not generate a game idea. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialMood && !generatedGame && !isLoading) { // Fetch on initial load if mood provided and no game yet
      // Check if form's current mood is actually the initial mood. If user changes mood before initial load finishes, don't fetch for initial.
      if (form.getValues("mood") === initialMood) {
        fetchGame(initialMood);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMood, form]); // removed generatedGame, isLoading from deps to avoid loop, rely on form mood

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setCurrentFormMood(data.mood);
    if (onMoodChange) {
      onMoodChange(data.mood);
    }
    await fetchGame(data.mood);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md bg-card shadow">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Mood to Generate a Game Idea</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // setCurrentFormMood(value as MoodEnum); // Let submit handle this
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a mood for the game" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moods.map((moodValue) => (
                      <SelectItem key={moodValue} value={moodValue}>
                        {moodValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Idea
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Brewing up a game for a "{form.getValues("mood")}" mood...</p>
        </div>
      )}

      {generatedGame && generatedGame.name && !isLoading && (
        <Card className="mt-6 shadow-xl border-primary animate-in fade-in-50 duration-500">
          <CardHeader className="bg-primary/10">
            <div className="flex items-center gap-3 mb-1">
              <Lightbulb className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl text-primary">{generatedGame.name}</CardTitle>
            </div>
            <CardDescription className="text-sm text-primary/80">
              A generated game idea for a "{form.getValues("mood")}" mood.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                <HelpCircle className="h-5 w-5 text-accent-foreground" />
                How to Play
              </h3>
              <p className="text-muted-foreground whitespace-pre-line bg-secondary/30 p-3 rounded-md leading-relaxed">{generatedGame.instructions}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-accent-foreground" />
                Benefits for the Couple/Group
              </h3>
              <p className="text-muted-foreground whitespace-pre-line bg-secondary/30 p-3 rounded-md leading-relaxed">{generatedGame.benefits}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !generatedGame?.name && form.formState.isSubmitted && (
         <Card className="mt-6 border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium text-muted-foreground">No game idea generated for "{form.getValues("mood")}".</p>
            <p className="text-sm text-muted-foreground">Please try a different mood or click "Generate New Idea" again.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
