import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center">
          <CalendarClock className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Event Scheduler</CardTitle>
          <CardDescription className="text-lg">
            Coming Soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to create, view, and manage all group meetings, outings, and special events. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
