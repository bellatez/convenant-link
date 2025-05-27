
import type { LucideIcon } from 'lucide-react';
import { Home, CalendarDays, BookOpenText, Puzzle, ListChecks, MapPin, Users, Sparkles } from 'lucide-react'; // Added Sparkles for games

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Covenant Link",
  description: "An app for Christian couples to connect, grow, and share.",
  url: "https://example.com", // Replace with your actual domain
  ogImage: "https://example.com/og.jpg", // Replace with your actual OG image URL
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Events",
      href: "/events",
      icon: CalendarDays,
    },
    {
      title: "Bible Study",
      href: "/bible",
      icon: BookOpenText,
    },
    {
      title: "Fun & Games", // Updated Title
      href: "/games",
      icon: Sparkles, // Using Sparkles icon, Puzzle can also work
    },
    {
      title: "Projects",
      href: "/projects",
      icon: ListChecks,
    },
    {
      title: "Outing Spots",
      href: "/outings",
      icon: MapPin,
    },
    {
      title: "Families",
      href: "/families",
      icon: Users,
    },
  ],
};

