import { signIn, signOut, useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

export const login = async () => {
  try {
    await signIn("github", { callbackUrl: "/" })
  } catch (error) {
    console.error('Login error:', error)
    toast({
      title: "Login Failed",
      description: "An error occurred during login. Please try again.",
      variant: "destructive",
    })
  }
}

export const logout = async () => {
  await signOut({ callbackUrl: "/" })
}

export const useAuth = () => {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const isAdmin = session?.user?.isAdmin || false

  return { isAuthenticated, isLoading, user: session?.user, isAdmin }
}