import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscussionTopicForm } from "./discussion-topic-form";

export default function DiscussionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Couples Discussion Topic Generator</CardTitle>
          <CardDescription>
            Generate meaningful discussion topics for your group meetings, complete with scripture references and guiding questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscussionTopicForm />
        </CardContent>
      </Card>
    </div>
  );
}
