"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

const outingSpots = [
  {
    name: "Kribi Beaches",
    description: "Relax on the beautiful white sand beaches of Kribi, enjoy fresh seafood, and visit the Lobé Waterfalls that fall directly into the sea.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "beach tropical",
    location: "Kribi, South Region",
    rating: 4.5,
  },
  {
    name: "Mount Cameroon National Park",
    description: "For adventurous couples, hike Mount Cameroon, West Africa's highest peak. Enjoy breathtaking views and unique volcanic landscapes.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "mountain hike",
    location: "Buea, Southwest Region",
    rating: 4.7,
  },
  {
    name: "Dja Faunal Reserve",
    description: "A UNESCO World Heritage site, perfect for wildlife enthusiasts. Explore one of Africa's largest and best-protected rainforests.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "rainforest wildlife",
    location: "East Region",
    rating: 4.3,
  },
  {
    name: "Foumban Royal Palace & Museum",
    description: "Discover the rich history and culture of the Bamoun people. Visit the historic palace and its impressive museum.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "palace museum",
    location: "Foumban, West Region",
    rating: 4.6,
  },
   {
    name: "Limbe Wildlife Centre",
    description: "A sanctuary for rescued primates and other wildlife. A great place for an educational and heartwarming visit.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "wildlife sanctuary",
    location: "Limbe, Southwest Region",
    rating: 4.4,
  },
  {
    name: "Ekom-Nkam Waterfalls",
    description: "Visit the stunning Ekom-Nkam waterfalls, famous for being a filming location for 'Greystoke: The Legend of Tarzan'.",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "waterfall nature",
    location: "Near Melong, Littoral Region",
    rating: 4.2,
  },
];

export default function OutingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Outing Spots in Cameroon</CardTitle>
          <CardDescription>
            Discover curated fun, romantic, and family-friendly places to visit within Cameroon for your next couple or group outing.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {outingSpots.map((spot) => (
          <Card key={spot.name} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-56">
              <Image
                src={spot.imageUrl}
                alt={spot.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={spot.aiHint}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{spot.name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground pt-1">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{spot.location}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-foreground/80">{spot.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-foreground">{spot.rating.toFixed(1)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('Google Maps link would open here for: ' + spot.name)}>
                View on Map
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
