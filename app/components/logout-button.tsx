"use client"

import { Button } from "@/app/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout, guestLogout } from "@/app/services/auth-service"
import { useAuth } from "@/app/services/auth-service"
import { useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export function LogoutButton() {
  const router = useRouter()
  const { isGuest } = useAuth()

  const clearContentFromLocalStorage = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('content/')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const handleLogout = useCallback(async () => {
    if (isGuest) {
      clearContentFromLocalStorage();
      await guestLogout();
      toast({
        title: "Logged out",
        description: "Guest content has been removed.",
        duration: 5000,
      });
    } else {
      await logout();
      toast({
        title: "Logged out",
        description: "Your content has been preserved.",
        duration: 5000,
      });
    }
    router.push("/login");
  }, [isGuest, clearContentFromLocalStorage, router]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="w-full justify-start hover:bg-accent hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isGuest ? "Exit Guest Mode" : "Log out"}
    </Button>
  )
}