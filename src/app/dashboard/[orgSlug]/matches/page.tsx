import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, History } from "lucide-react";

export default async function MatchesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events &amp; History</h1>
          <p className="text-muted-foreground mt-1">
            View history of all past events, sessions, competitions, and activities organized in your campus.
          </p>
        </div>
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Past Events Record
          </CardTitle>
          <CardDescription>
            A complete log of all completed events, registrations, and participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <CalendarDays className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No event history yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Once you start hosting events, fests, or workshops, the participant logs and event records will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
