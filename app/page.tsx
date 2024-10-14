import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from "lucide-react";

const HomeContent = dynamic(() => import("@/app/components/home-content"), {
  loading: () => <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>,
});

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <HomeContent />
    </Suspense>
  );
}