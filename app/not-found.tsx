import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { FileQuestion } from "lucide-react"
import { Link } from "next-view-transitions"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[420px]">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <FileQuestion className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Page Not Found</CardTitle>
          <CardDescription className="text-center">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            It seems you&apos;ve stumbled upon a page that doesn&apos;t exist in our MDX Manager. 
            Don&apos;t worry, you can easily navigate back to the main page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}