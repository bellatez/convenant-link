
"use client";

import type { Event, TopicProposal } from "./types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, BookOpen, Edit, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export function EventCard({ event, onEdit }: EventCardProps) {
  const selectedTopic = event.suggestedTopics.find(t => t.id === event.selectedTopicId);

  return (
    <Card className="w-full shadow-lg break-inside-avoid-column flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription>
              {format(event.date, "PPP")} at {event.time}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(event)} className="text-muted-foreground hover:text-primary">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Event</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {selectedTopic && (
          <div className="p-3 bg-secondary/50 rounded-md">
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
              <Lightbulb className="h-4 w-4" />
              <span>Discussion Topic</span>
            </div>
            <p className="text-foreground/90 font-semibold">{selectedTopic.topic}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <BookOpen className="h-3 w-3" />
              <span>{selectedTopic.scriptureReference}</span>
            </div>
          </div>
        )}
         {!selectedTopic && (
           <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">No discussion topic selected for this event.</p>
           </div>
         )}

        {event.location && (
          <div className="flex items-center gap-2 text-sm pt-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-foreground/90">{event.location}</p>
          </div>
        )}
         {!event.location && (
            <div className="flex items-center gap-2 text-sm pt-2">
                <MapPin className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                <p className="text-muted-foreground/70 italic">No location specified</p>
            </div>
         )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{format(event.date, "MMMM d, yyyy")}</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{event.time}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
