
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Added DialogClose
} from "@/components/ui/dialog";
import { EventForm } from "./event-form";
import { EventCard } from "./event-card";
import type { Event } from "./types";
import { CalendarPlus, CalendarX, ListFilter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterOptions = "all" | "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOptions>("upcoming");

  useEffect(() => {
    setIsMounted(true);
    //  Here you would typically fetch events from a backend/database
    // For now, we'll use local state which persists across navigation
    // due to Next.js client-side routing, but not browser refresh.
  }, []);

  const handleFormSubmit = () => {
    setIsDialogOpen(false); // Close dialog after form submission
  };

  const now = new Date();

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    // Combine date and time for accurate comparison
    const [hours, minutes] = event.time.split(':').map(Number);
    eventDate.setHours(hours, minutes, 0, 0);

    if (filter === "upcoming") {
      return eventDate >= now;
    }
    if (filter === "past") {
      return eventDate < now;
    }
    return true; // "all"
  }).sort((a,b) => { // Ensure consistent sorting after filtering
    const aDateTime = new Date(a.date);
    const [aHours, aMinutes] = a.time.split(':').map(Number);
    aDateTime.setHours(aHours, aMinutes, 0, 0);

    const bDateTime = new Date(b.date);
    const [bHours, bMinutes] = b.time.split(':').map(Number);
    bDateTime.setHours(bHours, bMinutes, 0, 0);
    
    if (filter === "past") {
      return bDateTime.getTime() - aDateTime.getTime(); // Sort past events descending (most recent first)
    }
    return aDateTime.getTime() - bDateTime.getTime(); // Sort upcoming events ascending (soonest first)
  });

  if (!isMounted) {
    // You can render a loading skeleton here if needed
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
         <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="items-center">
                <CalendarPlus className="h-16 w-16 text-primary mb-4" />
                <CardTitle className="text-3xl font-bold">Event Scheduler</CardTitle>
                <CardDescription className="text-lg">Loading events...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-24 bg-muted rounded w-full mx-auto"></div>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Group Events</CardTitle>
              <CardDescription>
                Create, view, and manage all group meetings, outings, and special events.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter Events
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as FilterOptions)}>
                    <DropdownMenuRadioItem value="upcoming">Upcoming</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="past">Past</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="all">All Events</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Add New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create a New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to schedule a new event for the group.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <EventForm setEvents={setEvents} onFormSubmit={handleFormSubmit} />
                  </div>
                  {/* DialogClose is often not needed if form submission handles closing */}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Separator />

      {filteredEvents.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
            <CalendarX className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {filter === "all" && events.length > 0 ? "No events match the current filter" : 
               filter === "upcoming" ? "No Upcoming Events" :
               filter === "past" ? "No Past Events" :
               "No Events Yet"}
            </h3>
            <p className="text-muted-foreground">
              {filter === "all" && events.length > 0 ? "Try a different filter to see other events." :
               filter === "upcoming" && events.length > 0 ? "All events are in the past. Check 'Past' or 'All Events'." :
               filter === "past" && events.length > 0 ? "No events have occurred yet. Check 'Upcoming' or 'All Events'." :
               "Get started by adding a new event!"
              }
            </p>
            {events.length === 0 && (
                 <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                    <CalendarPlus className="mr-2 h-4 w-4" /> Add First Event
                </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
