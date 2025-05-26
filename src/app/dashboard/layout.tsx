"use client";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NotificationsIcon } from "@/components/layout/NotificationsIcon";
import { UserButton } from "@/components/layout/UserButton";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  console.log("LAYOUT/PAGE RENDERED");
  
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  console.log("AUTH DEBUG", { user, role, loading });

  if (!user) {
    // This case should ideally be handled by the middleware or root page redirect,
    // but as a fallback:
    return null; 
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden mr-2">
               <PanelLeft className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-foreground">
              {/* Dynamically set based on page or role */}
              {role === 'admin' ? 'Admin Portal' : 'New Hire Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <NotificationsIcon />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
        <footer className="border-t bg-background/80 backdrop-blur-md px-4 py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NubbiAI. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
