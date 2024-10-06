"use client"

import { Button } from "@/app/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/app/services/auth-service"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="w-full justify-start hover:bg-foreground/10"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  )
}