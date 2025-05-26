"use client";
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function AppLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary-foreground transition-colors duration-200">
      <Rocket className="h-7 w-7 text-sidebar-primary" />
      {!collapsed && <span className="text-xl font-semibold">NubbiAI</span>}
    </Link>
  );
}
