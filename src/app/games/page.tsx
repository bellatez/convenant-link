import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameGeneratorForm } from "./game-generator-form";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Christian Couple Game Generator</CardTitle>
          <CardDescription>
            Spark some fun and connection! Select a mood and let our AI suggest faith-based games for your next get-together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}
