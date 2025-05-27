"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageCircleQuestion, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCouplesDiscussionTopic, type GenerateCouplesDiscussionTopicOutput } from "@/ai/flows/generate-couples-discussion-topic";

const formSchema = z.object({
  topicPreferences: z.string().min(10, "Please describe your topic preferences in at least 10 characters."),
  meetingContext: z.string().min(10, "Please provide some meeting context (at least 10 characters)."),
});

type FormValues = z.infer<typeof formSchema>;

export function DiscussionTopicForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTopic, setGeneratedTopic] = useState<GenerateCouplesDiscussionTopicOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicPreferences: "",
      meetingContext: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedTopic(null);
    try {
      const result = await generateCouplesDiscussionTopic(data);
      setGeneratedTopic(result);
    } catch (error) {
      console.error("Error generating discussion topic:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Topic",
        description: "Could not generate a discussion topic. Please try again.",
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
            name="topicPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Preferences</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., communication in marriage, spiritual growth, parenting challenges"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the desired theme, depth, or scripture focus.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Context</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., upcoming monthly meeting, recent sermon series on forgiveness"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Information about the meeting, attendees, or recent events.
                </FormDescription>
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
              "Generate Topic"
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
         <div className="flex justify-center items-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {generatedTopic && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">{generatedTopic.topic}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
                Scripture References
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedTopic.scriptureReferences}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-foreground">
                <MessageCircleQuestion className="h-5 w-5 text-accent-foreground" />
                Suggested Questions
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedTopic.suggestedQuestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
       {generatedTopic === null && !isLoading && form.formState.isSubmitted && (
         <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Could not generate a topic based on the provided input. Please try refining your preferences and context.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
