"use client";

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Notification } from '@/types';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockNotifications: Notification[] = [
  { id: '1', message: 'New training module "Company Culture" assigned.', type: 'info', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', message: 'Your quiz score for "Security Basics" is 85%.', type: 'success', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '3', message: 'Deadline for "Compliance Training" is approaching.', type: 'warning', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '4', message: 'Welcome to NubbiAI!', type: 'info', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
];


export function NotificationsIcon() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {mockNotifications.length === 0 ? (
             <DropdownMenuItem disabled className="text-center text-sm text-muted-foreground py-4">No notifications</DropdownMenuItem>
          ) : (
            mockNotifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className={`flex flex-col items-start gap-1 ${!notification.read ? 'bg-accent/50' : ''}`}>
              <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </DropdownMenuItem>
          )))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-accent hover:!text-accent-foreground cursor-pointer">
            View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
