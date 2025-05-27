
"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Lightbulb, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Event, TopicProposal } from "./types";
import { useToast } from "@/hooks/use-toast";
import { generateEventTopics, type GenerateEventTopicsOutput } from "@/ai/flows/generate-event-topics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  date: z.date({ required_error: "Please select a date for the event." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Please enter a valid time in HH:MM format (e.g., 14:30)."),
  location: z.string().optional(),
  selectedTopicId: z.string({required_error: "Please select a discussion topic."}).min(1, "Please select a discussion topic."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Helper function to get the next first Sunday
const getNextFirstSunday = (): Date => {
  const today = new Date();
  let date = new Date(today.getFullYear(), today.getMonth(), 1); // Start from the first of the current month
  
  // Find the first Sunday of the current month
  while (date.getDay() !== 0) { // 0 is Sunday
    date.setDate(date.getDate() + 1);
  }

  // If this Sunday has passed or is today (and we want the *next* one if it's today for scheduling future events)
  // But for defaulting, if it's today and it's the first Sunday, it's fine.
  // The crucial part is ensuring it's in the future if the calculated first Sunday is in the past.
  if (date < today && !(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())) {
    date = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
  }
  return date;
};


interface EventFormProps {
  setEvents: Dispatch<SetStateAction<Event[]>>;
  onFormSubmit: () => void; // Callback to close dialog
  eventToEdit?: Event | null;
}

export function EventForm({ setEvents, onFormSubmit, eventToEdit }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<TopicProposal[]>(eventToEdit?.suggestedTopics || []);
  const { toast } = useToast();
  const formMode = eventToEdit ? "edit" : "create";

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: eventToEdit?.title || "",
      date: eventToEdit?.date || (formMode === "create" ? getNextFirstSunday() : new Date()),
      time: eventToEdit?.time || "18:00", // Default time
      location: eventToEdit?.location || "",
      selectedTopicId: eventToEdit?.selectedTopicId || undefined,
    },
  });

 useEffect(() => {
    if (formMode === "create" && suggestedTopics.length === 0) {
      setIsGeneratingTopics(true);
      generateEventTopics()
        .then((topicsOutput) => {
          const topicsWithIds = topicsOutput.map(topic => ({
            ...topic,
            id: crypto.randomUUID(),
          }));
          setSuggestedTopics(topicsWithIds);
          if (topicsWithIds.length > 0 && !form.getValues("selectedTopicId")) {
            // Pre-select the first topic if none is selected yet
            // form.setValue("selectedTopicId", topicsWithIds[0].id);
          }
        })
        .catch(err => {
          console.error("Error generating topics:", err);
          toast({
            variant: "destructive",
            title: "Topic Generation Failed",
            description: "Could not generate discussion topics. Please try again or add an event manually.",
          });
        })
        .finally(() => setIsGeneratingTopics(false));
    } else if (formMode === "edit" && eventToEdit) {
        setSuggestedTopics(eventToEdit.suggestedTopics);
        form.reset({ // Reset form with eventToEdit values when it changes or on initial load for edit
            title: eventToEdit.title,
            date: eventToEdit.date,
            time: eventToEdit.time,
            location: eventToEdit.location || "",
            selectedTopicId: eventToEdit.selectedTopicId || undefined,
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventToEdit, formMode]); // form.reset and form.setValue should not be in deps usually

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    setIsLoading(true);
    try {
      if (formMode === "create") {
        if (suggestedTopics.length === 0) {
          toast({
            variant: "destructive",
            title: "No Topics",
            description: "Topic proposals are still generating or failed. Please wait or try again.",
          });
          setIsLoading(false);
          return;
        }
        const newEvent: Event = {
          id: crypto.randomUUID(),
          ...data,
          suggestedTopics: suggestedTopics, // these now include IDs
        };
        setEvents((prevEvents) => [...prevEvents, newEvent].sort((a,b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time)));
        toast({
          title: "Event Created",
          description: `"${data.title}" has been scheduled.`,
        });
      } else if (eventToEdit) {
        const updatedEvent: Event = {
          ...eventToEdit,
          ...data,
          suggestedTopics: eventToEdit.suggestedTopics, // Keep original suggestions
        };
        setEvents((prevEvents) =>
          prevEvents.map(event => event.id === eventToEdit.id ? updatedEvent : event)
          .sort((a,b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time))
        );
        toast({
          title: "Event Updated",
          description: `"${data.title}" has been updated.`,
        });
      }
      form.reset({ title: "", date: getNextFirstSunday(), time: "18:00", location: "", selectedTopicId: undefined });
      setSuggestedTopics([]); // Clear topics for next "create" form
      onFormSubmit();
    } catch (error) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} event:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${formMode === 'create' ? 'create' : 'update'} event. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Fellowship" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        formMode === "create" ? date < new Date(new Date().setHours(0,0,0,0)) : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time (HH:MM)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Church Hall or Zoom Link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="selectedTopicId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" /> Discussion Topic Proposals
              </FormLabel>
              <FormDescription>
                {formMode === 'create' ? 'Select one of the AI-generated topics for this meeting.' : 'You can change the selected topic for this meeting.'}
              </FormDescription>
              {isGeneratingTopics && formMode === 'create' ? (
                <div className="flex items-center space-x-2 p-4 border rounded-md">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Generating inspiring topics...</span>
                </div>
              ) : suggestedTopics.length > 0 ? (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4"
                >
                  {suggestedTopics.map((topic) => (
                    <FormItem key={topic.id} className="w-full">
                       <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", field.value === topic.id && "ring-2 ring-primary border-primary")}>
                        <CardHeader className="flex flex-row items-center space-x-3 p-4">
                            <FormControl>
                               <RadioGroupItem value={topic.id} id={topic.id} className="flex-shrink-0" />
                            </FormControl>
                            <label htmlFor={topic.id} className="w-full cursor-pointer">
                                <CardTitle className="text-md font-medium">{topic.topic}</CardTitle>
                                <CardDescription className="text-xs flex items-center mt-1">
                                    <BookOpen className="h-3 w-3 mr-1.5 text-muted-foreground" />
                                    {topic.scriptureReference}
                                </CardDescription>
                            </label>
                        </CardHeader>
                       </Card>
                    </FormItem>
                  ))}
                </RadioGroup>
              ) : (
                 <p className="text-muted-foreground p-4 border rounded-md">No topic proposals available. This might be due to an error during generation.</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || (formMode === 'create' && isGeneratingTopics)}>
            {(isLoading || (formMode === 'create' && isGeneratingTopics))&& <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? (formMode === 'create' ? "Creating..." : "Updating...") : (formMode === 'create' ? "Create Event" : "Update Event")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
