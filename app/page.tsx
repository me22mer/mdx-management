
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to MDX Manager</h1>
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Manage and edit your MDX content with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Select a page from the sidebar to edit or preview MDX content.</p>
          <Button asChild>
            <Link href="/edit/blog/first-post">Edit Sample Post</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}