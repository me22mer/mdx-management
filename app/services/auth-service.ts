import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export const login = async () => {
  try {
    await signIn("github", { callbackUrl: "/" });
    toast({
      title: "Logged in with GitHub",
      description: "Your content will be preserved across sessions.",
      duration: 5000,
    });
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Login Failed",
      description: "An error occurred during login. Please try again.",
      variant: "destructive",
    });
  }
};

export const guestLogin = async () => {
  try {
    await signIn("credentials", {
      username: "guest",
      password: "guestpassword",
      callbackUrl: "/",
    });
    toast({
      title: "Logged in as Guest",
      description: "Your content will be removed when you log out.",
      duration: 5000,
    });
  } catch (error) {
    console.error('Guest login error:', error);
    toast({
      title: "Guest Login Failed",
      description: "An error occurred during guest login. Please try again.",
      variant: "destructive",
    });
  }
};

export const logout = async () => {
  await signOut({ callbackUrl: "/login" });
};

export const guestLogout = async () => {
  await signOut({ callbackUrl: "/login" });
};

export const useAuth = () => {
  const { data: session, status } = useSession();
  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
    isAdmin: session?.user?.isAdmin || false,
    isGuest: session?.user?.isGuest || false
  };
};