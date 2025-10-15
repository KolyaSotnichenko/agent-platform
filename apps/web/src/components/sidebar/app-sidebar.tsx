"use client";

import * as React from "react";
import { Wrench, Bot, MessageCircle, Brain, BarChart3 } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SiteHeader } from "./sidebar-header";
import { NavOpen } from "./nav-open";
import { BetaBanner } from "./beta-banner";

// This is sample data.
const data = {
  NavOpen: [
    {
      title: "Overview",
      url: "/overview",
      icon: BarChart3,
    },
  ],
  navMain: [
    {
      title: "Chat",
      url: "/",
      icon: MessageCircle,
    },
    {
      title: "Agents",
      url: "/agents",
      icon: Bot,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Wrench,
    },
    // {
    //   title: "Inbox",
    //   url: "/inbox",
    //   icon: Inbox,
    // },
    {
      title: "RAG",
      url: "/rag",
      icon: Brain,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SiteHeader />
      <SidebarContent>
        <NavOpen items={data.NavOpen} />
        <NavMain items={data.navMain} />
        <BetaBanner />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
