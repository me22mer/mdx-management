"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Github, Loader2, AlertCircle, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { login, guestLogin } from "@/app/services/auth-service";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleLogin = async (loginFunction: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);

    try {
      await loginFunction();
      router.push(callbackUrl);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to MDX Manager</CardTitle>
          <CardDescription>
            Choose your preferred method to access the MDX Manager
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLogin(login)}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Github className="mr-2 h-4 w-4" />
                  )}{" "}
                  Sign in with GitHub
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign in with your GitHub account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue as
              </span>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLogin(guestLogin)}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}{" "}
                  Continue as Guest
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Access limited features without an account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
        {/* <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
}