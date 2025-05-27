
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { SidebarNav } from './sidebar-nav';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect runs only on client-side after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPage = siteConfig.mainNav.find(item => item.href === pathname);
  const pageTitle = currentPage?.title || siteConfig.name;

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };


  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {siteConfig.name}
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4">
           {/* Theme toggle button, only rendered on client after mount */}
           {mounted && setTheme && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
          {/* Add other header elements like search or user menu here */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
