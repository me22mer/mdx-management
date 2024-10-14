"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useAuth } from "@/app/services/auth-service"

export function ContentManagementInfo() {
  const { isGuest } = useAuth()

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Content Management Information</CardTitle>
        <CardDescription>
          Important information about how your content is managed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGuest ? (
          <p>
            You are currently logged in as a guest. Please note that any content you create will be
            stored locally in your browser and will be removed when you log out. To preserve your
            content across sessions, consider logging in with a GitHub account.
          </p>
        ) : (
          <p>
            You are logged in with a GitHub account. Your content is securely stored and will be
            preserved across sessions. You can safely log out and log back in without losing your work.
          </p>
        )}
      </CardContent>
    </Card>
  )
}