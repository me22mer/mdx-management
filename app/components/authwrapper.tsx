"use client";

import { useSession } from "next-auth/react";
import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      router.push("/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}