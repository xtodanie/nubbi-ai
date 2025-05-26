"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-7 w-7 text-primary" /> User Management
          </CardTitle>
          <CardDescription>
            This section is for managing user accounts, roles, and permissions.
            Full functionality will be implemented in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Under Construction" 
              width={600} 
              height={400} 
              className="mx-auto rounded-lg shadow-md"
              data-ai-hint="construction team"
            />
          <p className="mt-6 text-lg text-muted-foreground">
            User management features are currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
