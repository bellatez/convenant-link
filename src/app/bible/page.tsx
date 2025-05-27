import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked } from "lucide-react";

export default function BiblePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center">
          <BookMarked className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Interactive Bible Study</CardTitle>
          <CardDescription className="text-lg">
            Coming Soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon, you'll be able to read the Bible together, share notes, highlight verses, and engage in threaded discussions right here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
