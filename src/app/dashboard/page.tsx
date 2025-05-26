"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Bot, BookOpenCheck, ClipboardList, Loader2, Users, UploadCloud } from "lucide-react";
import Image from "next/image";

// Placeholder components for admin and new-hire views
function AdminDashboardView() {
  const kpis = [
    { title: "Active Users", value: "125", icon: Users, change: "+5%", color: "text-green-500" },
    { title: "Completion Rate", value: "78%", icon: ClipboardList, change: "+2%", color: "text-green-500" },
    { title: "Avg. Quiz Score", value: "82%", icon: BookOpenCheck, change: "-1%", color: "text-red-500" },
    { title: "Materials Uploaded", value: "42", icon: UploadCloud, change: "+3", color: "text-blue-500" },
  ];

  const quickLinks = [
    { href: "/dashboard/admin/file-upload", label: "Upload Materials", icon: UploadCloud },
    { href: "/dashboard/admin/user-management", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/performance", label: "View Performance", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Overview</CardTitle>
          <CardDescription>Key metrics and quick actions for managing the onboarding platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map(kpi => (
              <Card key={kpi.title} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.color}`}>{kpi.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map(link => (
            <Button key={link.href} variant="outline" asChild className="justify-start text-left h-auto py-3 shadow hover:shadow-md transition-shadow">
              <Link href={link.href} className="flex items-center gap-3">
                <link.icon className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">{link.label}</p>
                  <p className="text-xs text-muted-foreground">Navigate to {link.label.toLowerCase()}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NewHireDashboardView() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src="https://placehold.co/1200x400.png" 
            alt="Welcome Banner" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="office team" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome, {user?.displayName || user?.email}!</h1>
            <p className="text-lg text-gray-200 mt-1">Ready to start your onboarding journey?</p>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">
            We're excited to have you on board! This dashboard is your central hub for all onboarding activities, resources, and support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  My Onboarding Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Track your progress through various modules and tasks.</p>
                <Button asChild>
                  <Link href="/dashboard/new-hire/journey">
                    View My Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  AI Tutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Have questions? Our AI assistant is here to help 24/7.</p>
                <Button asChild>
                  <Link href="/dashboard/new-hire/ai-tutor">
                    Ask AI Tutor <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (role === "admin") {
    return <AdminDashboardView />;
  }
  if (role === "new-hire") {
    return <NewHireDashboardView />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to NubbiAI</CardTitle>
        <CardDescription>Your role is not fully determined or an error occurred. Please contact support.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Loading user information or role not assigned.</p>
      </CardContent>
    </Card>
  );
}
