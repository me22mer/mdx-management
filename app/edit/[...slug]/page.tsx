import { Suspense } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

const EditPageContent = dynamic(() => import('@/app/components/edit-page-content'), {
  loading: () => <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>,
});

export default async function EditPage({ params }: { params: { slug: string[] } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <EditPageContent params={params} />
    </Suspense>
  );
}