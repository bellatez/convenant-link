
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";
import type { Event } from "./events/types";
import type { Project, Contribution } from "./projects/types";
import type { Family } from "./families/types"; // Added Family type import
import { format } from "date-fns";
import { CalendarDays, ListChecks, ExternalLink, Clock, Users, HomeIcon } from "lucide-react"; // Added Users icon

const formatXAF = (amount: number): string => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const calculateCurrentAmount = (contributions: Contribution[]): number => {
  return contributions.reduce((acc, curr) => acc + curr.amount, 0);
};

export default function DashboardPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [families, setFamilies] = useState<Family[]>([]); // Added state for families
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load events from localStorage
    const storedEvents = localStorage.getItem("covenantLinkEvents");
    if (storedEvents) {
      const parsedEvents: Event[] = JSON.parse(storedEvents, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      const now = new Date();
      now.setHours(0,0,0,0);
      const futureEvents = parsedEvents
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); 
      setUpcomingEvents(futureEvents);
    }

    // Load projects from localStorage
    const storedProjects = localStorage.getItem("covenantLinkProjects");
    if (storedProjects) {
      const parsedProjects: Project[] = JSON.parse(storedProjects, (key, value) => {
        if (key === 'deadline' || key === 'date') return new Date(value);
        return value;
      });
      const now = new Date();
      now.setHours(0,0,0,0);
      const currentProjects = parsedProjects
        .filter(project => new Date(project.deadline) >= now)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3); 
      setActiveProjects(currentProjects);
    }

    // Load families from localStorage
    const storedFamilies = localStorage.getItem("covenantLinkFamilies");
    if (storedFamilies) {
      const parsedFamilies: Family[] = JSON.parse(storedFamilies);
      setFamilies(parsedFamilies.slice(0, 5)); // Display top 5 families for brevity
    }

  }, []);


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to {siteConfig.name}!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Dedicated to fostering stronger, faith-centered relationships among Christian couples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base">
            Our platform provides tools and resources to encourage spiritual growth, meaningful connections, and joyful fellowship within our community. We aim to support your journey together in Christ by facilitating shared experiences, learning, and mutual support.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Upcoming Events</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/events">View All <ExternalLink className="ml-1.5 h-3 w-3"/></Link>
              </Button>
            </div>
            <CardDescription>Latest gatherings and meetings.</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted && upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="p-2.5 bg-secondary/50 rounded-md shadow-sm">
                    <h4 className="font-semibold text-sm text-foreground truncate">{event.title}</h4>
                    <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <CalendarDays className="mr-1.5 h-3 w-3" /> {format(event.date, "MMM d, yyyy")}
                      <Clock className="ml-2.5 mr-1.5 h-3 w-3" /> {event.time}
                    </div>
                     {event.selectedTopicId && event.suggestedTopics.find(t => t.id === event.selectedTopicId) && (
                        <p className="text-xs text-primary mt-0.5 truncate">
                            Topic: {event.suggestedTopics.find(t => t.id === event.selectedTopicId)?.topic}
                        </p>
                     )}
                  </li>
                ))}
              </ul>
            ) : isMounted ? (
              <p className="text-muted-foreground text-center py-4 text-sm">No upcoming events.</p>
            ) : (
              <div className="space-y-2"> 
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Active Projects</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/projects">View All <ExternalLink className="ml-1.5 h-3 w-3"/></Link>
              </Button>
            </div>
            <CardDescription>Ongoing group initiatives.</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted && activeProjects.length > 0 ? (
              <ul className="space-y-3">
                {activeProjects.map((project) => {
                  const currentAmount = calculateCurrentAmount(project.contributions);
                  const progressPercentage = project.targetAmount > 0 ? Math.min((currentAmount / project.targetAmount) * 100, 100) : 0;
                  return (
                    <li key={project.id} className="p-2.5 bg-secondary/50 rounded-md shadow-sm">
                      <h4 className="font-semibold text-sm text-foreground truncate">{project.name}</h4>
                      <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <CalendarDays className="mr-1.5 h-3 w-3" /> Deadline: {format(project.deadline, "MMM d, yyyy")}
                      </div>
                      <div className="mt-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                          <span>Progress</span>
                          <span>XAF {formatXAF(currentAmount)} / {formatXAF(project.targetAmount)}</span>
                        </div>
                        <Progress value={progressPercentage} aria-label={`${project.name} progress ${progressPercentage.toFixed(0)}%`} className="h-1.5" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : isMounted ? (
              <p className="text-muted-foreground text-center py-4 text-sm">No active projects.</p>
            ) : (
               <div className="space-y-2"> 
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Registered Families</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/families">Manage <ExternalLink className="ml-1.5 h-3 w-3"/></Link>
              </Button>
            </div>
            <CardDescription>Current families in the group.</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted && families.length > 0 ? (
              <ul className="space-y-2">
                {families.map((family) => (
                  <li key={family.id} className="p-2 bg-secondary/50 rounded-md shadow-sm text-sm text-foreground truncate">
                    {family.name} Family
                  </li>
                ))}
                {localStorage.getItem("covenantLinkFamilies") && JSON.parse(localStorage.getItem("covenantLinkFamilies")!).length > 5 && (
                  <li className="text-xs text-muted-foreground text-center pt-1">...and more.</li>
                )}
              </ul>
            ) : isMounted ? (
              <p className="text-muted-foreground text-center py-4 text-sm">No families registered.</p>
            ) : (
              <div className="space-y-2"> 
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-1">Explore Features</h2>
        <p className="text-muted-foreground mb-4">Navigate through the app's sections using the cards below or the sidebar.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {siteConfig.mainNav.filter(item => item.href !== "/").map((item) => (
            <Card key={item.href} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <item.icon className="h-7 w-7 text-primary" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  Access the {item.title.toLowerCase()} section.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={item.href}>Go to {item.title}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

