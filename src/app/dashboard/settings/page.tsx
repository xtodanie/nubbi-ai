"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Palette, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-7 w-7 text-primary" /> Application Settings
          </CardTitle>
          <CardDescription>
            Manage your application preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive important updates and alerts via email.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inapp-notifications" className="flex flex-col space-y-1">
                <span>In-App Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Show notifications directly within the app.
                </span>
              </Label>
              <Switch id="inapp-notifications" defaultChecked />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/> Appearance</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes. (Theme switching not fully implemented)
                </span>
              </Label>
              <Switch id="dark-mode" onCheckedChange={(checked) => {
                if (checked) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              }}/>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/> Account & Security</h3>
            <Button variant="outline">Change Password</Button>
            <Button variant="destructive">Delete Account</Button>
            <p className="text-xs text-muted-foreground">
                Account deletion is permanent and cannot be undone.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
