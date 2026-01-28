"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

interface HelpRequestCardProps {
  title: string
  city: string
  description: string
  status?: string
}

export function HelpRequestCard({ title, city, description, status = "Open" }: HelpRequestCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  const handleHelpClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      // Handle help action when logged in
      alert("Thank you for offering to help!")
    }
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 bg-accent text-accent-foreground">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{city}</span>
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        {isLoggedIn ? (
          <Button className="w-full" onClick={handleHelpClick}>
            I help
          </Button>
        ) : (
          <>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleHelpClick}
            >
              I help
            </Button>
            <p className="text-xs text-muted-foreground">Login to participate</p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
