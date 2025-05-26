"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Edit3, Loader2, UserCircle } from "lucide-react";
import React, { useState } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // Mock editable fields
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");

  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return <div className="flex h-full items-center justify-center"><p>User not found.</p></div>;
  }
  
  const handleSave = () => {
    // Mock save, in real app update Firebase profile
    console.log("Saving profile:", { displayName, email });
    setIsEditing(false);
    // Potentially update user in AuthContext if changes are successful
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCircle className="h-7 w-7 text-primary" /> User Profile
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>
            View and manage your profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png`} alt={user.displayName || user.email || "User"} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-3xl bg-muted">{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {isEditing && <Button variant="outline" size="sm">Change Photo</Button>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} disabled={!isEditing} className={!isEditing ? "border-0 bg-transparent px-0 shadow-none" : ""} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email}  onChange={e => setEmail(e.target.value)} disabled={!isEditing} className={!isEditing ? "border-0 bg-transparent px-0 shadow-none" : ""} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role?.toUpperCase() || "N/A"} disabled className="border-0 bg-transparent px-0 shadow-none font-semibold" />
            </div>
             <div className="space-y-1">
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" value={user.id} disabled className="border-0 bg-transparent px-0 shadow-none text-xs" />
            </div>
          </div>

        </CardContent>
        {isEditing && (
          <CardFooter className="border-t pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
