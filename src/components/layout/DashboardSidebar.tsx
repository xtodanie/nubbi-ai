"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppLogo } from "./AppLogo";
import { useAuth } from "@/contexts/AuthContext";
import { navItems } from "@/config/navConfig";
import type { NavItem, UserRole } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Settings, ChevronsLeftRight } from "lucide-react";


export function DashboardSidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();
  const { state, toggleSidebar } = useSidebar(); // Get sidebar state and toggle function

  const isActive = (href: string, isSubItem: boolean = false) => {
    if (isSubItem) return pathname === href;
    return pathname.startsWith(href) && (href === "/dashboard" ? pathname === href : true) ;
  };

  const renderNavItems = (items: NavItem[], currentRole: UserRole, isSubMenu: boolean = false) => {
    return items
      .filter(item => item.roles?.includes(currentRole || "new-hire") || !item.roles)
      .map((item) => {
        const MenuButtonComponent = isSubMenu ? SidebarMenuSubButton : SidebarMenuButton;
        const MenuItemComponent = isSubMenu ? SidebarMenuSubItem : SidebarMenuItem;
        
        return (
          <MenuItemComponent key={item.href}>
            <MenuButtonComponent
              asChild
              isActive={isActive(item.href, isSubMenu)}
              tooltip={{ children: item.label, hidden: state === "expanded" }}
              disabled={item.disabled}
              className={isSubMenu ? "text-sm" : ""}
            >
              <Link href={item.href}>
                <item.icon className={isSubMenu ? "h-4 w-4" : "h-5 w-5"} />
                <span className="truncate">{item.label}</span>
              </Link>
            </MenuButtonComponent>
            {item.children && item.children.length > 0 && (
              <SidebarMenuSub>
                {renderNavItems(item.children, currentRole, true)}
              </SidebarMenuSub>
            )}
          </MenuItemComponent>
        );
      });
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <AppLogo collapsed={state === "collapsed"}/>
        {state === "expanded" && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent">
             <ChevronsLeftRight className="h-5 w-5" />
          </Button>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarMenu className="p-2 md:p-4">
            {renderNavItems(navItems, role)}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <SidebarMenuButton
            asChild
            isActive={isActive("/dashboard/settings")}
            tooltip={{ children: "Settings", hidden: state === "expanded"}}
        >
            <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
            </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
