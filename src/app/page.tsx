import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to {siteConfig.name}!</CardTitle>
          <CardDescription>
            Your central hub for connecting, growing, and sharing with fellow Christian couples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Navigate through the sidebar to explore features like event scheduling, interactive Bible study, game and discussion generators, project tracking, and discovering outing spots.
          </p>
          <p>We pray this platform strengthens your bond and enriches your journey together in Christ.</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {siteConfig.mainNav.filter(item => item.href !== "/").map((item) => (
          <Card key={item.href} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <item.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                {/* Add a short description for each section here if available */}
                Explore {item.title.toLowerCase()} and engage with the group.
              </CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={item.href}>Go to {item.title}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
