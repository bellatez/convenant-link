
"use client";

import type { Event } from "./types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, FileText, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="w-full shadow-lg break-inside-avoid-column">
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription>
          {format(event.date, "PPP")} at {event.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <p className="text-foreground/90 whitespace-pre-line">{event.description}</p>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-foreground/90">{event.location}</p>
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
