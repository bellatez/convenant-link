"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateChristianCoupleGame, type GenerateChristianCoupleGameOutput } from "@/ai/flows/generate-christian-couple-game";

const moods = ["Fun", "Deep", "Spiritual", "Icebreaker", "Challenge", "Trivia"] as const;

const formSchema = z.object({
  mood: z.enum(moods, { required_error: "Please select a mood." }),
});

type FormValues = z.infer<typeof formSchema>;

export function GameGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGames, setGeneratedGames] = useState<GenerateChristianCoupleGameOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: "Fun",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedGames(null);
    try {
      const result = await generateChristianCoupleGame({ mood: data.mood });
      setGeneratedGames(result);
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Game",
        description: "Could not generate game ideas. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Mood</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a mood for the game" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
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
              "Generate Games"
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {generatedGames && generatedGames.gameIdeas && generatedGames.gameIdeas.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Game Ideas for a "{form.getValues("mood")}" Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-3 pl-5 text-foreground">
              {generatedGames.gameIdeas.map((idea, index) => (
                <li key={index} className="text-md leading-relaxed">{idea}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {generatedGames && (!generatedGames.gameIdeas || generatedGames.gameIdeas.length === 0) && !isLoading && (
         <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No game ideas were generated for this mood. Try a different selection!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
