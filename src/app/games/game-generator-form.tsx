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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, HelpCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateChristianCoupleGame, type GenerateChristianCoupleGameOutput } from "@/ai/flows/generate-christian-couple-game";
import { Separator } from "@/components/ui/separator";

const moods = ["Fun", "Deep", "Spiritual", "Icebreaker", "Challenge", "Trivia"] as const;

const formSchema = z.object({
  mood: z.enum(moods, { required_error: "Please select a mood." }),
});

type FormValues = z.infer<typeof formSchema>;

export function GameGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GenerateChristianCoupleGameOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: "Fun",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedGame(null);
    try {
      const result = await generateChristianCoupleGame({ mood: data.mood });
      setGeneratedGame(result);
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
              "Generate Game Idea"
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {generatedGame && generatedGame.name && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl">{generatedGame.name}</CardTitle>
            </div>
            <CardDescription>
              A game idea for a "{form.getValues("mood")}" mood.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-foreground">
                <HelpCircle className="h-5 w-5 text-accent-foreground" />
                How to Play
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedGame.instructions}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-accent-foreground" />
                Benefits for the Group
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedGame.benefits}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {form.formState.isSubmitted && !isLoading && !generatedGame?.name && (
         <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Could not generate a game idea for this mood. Try a different selection or try again!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
