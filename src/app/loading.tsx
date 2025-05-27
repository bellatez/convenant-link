
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-6">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <CardTitle className="text-2xl font-semibold">Loading Page</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground">
            Please wait while we fetch the content...
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
