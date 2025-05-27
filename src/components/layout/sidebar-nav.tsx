"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <SidebarMenu>
        {siteConfig.mainNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.title, side: "right", align: "center" }}
              disabled={item.disabled}
            >
              <Link href={item.href}>
                <item.icon aria-hidden="true" />
                <span>{item.title}</span>
                {item.label && (
                  <SidebarMenuBadge>{item.label}</SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
