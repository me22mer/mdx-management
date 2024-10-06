"use client";

import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import { SkeletonSidebar } from "./skeleton-sidebar";

const Sidebar = dynamic(() => import('./sidebar').then((mod) => mod.Sidebar), {
  ssr: false,
  loading: () => <SkeletonSidebar />
});

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-background text-foreground">
      {session && <Sidebar />}
      <div className={`flex-1 overflow-y-auto p-6 ${session ? '' : 'w-full'}`}>
        {children}
      </div>
    </div>
  );
}