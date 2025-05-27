import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center">
          <Target className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Group Projects & Contributions</CardTitle>
          <CardDescription className="text-lg">
            Coming Soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This space will help track group projects, like the "End-of-year food purchase," and monitor contributions from each couple. Features will include progress bars, deadlines, and reminders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
