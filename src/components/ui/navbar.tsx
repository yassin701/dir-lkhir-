"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart, LogOut } from "lucide-react"
import { useSession, signOut } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        }
      }
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Dir-Khir</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" className="text-sm font-medium">
              Home
            </Button>
          </Link>

          {isLoggedIn && (
            <Link href="/create">
              <Button variant="ghost" className="text-sm font-medium">
                Add Help
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Login / Register
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-4 pt-8">
              <Link href="/" className="flex items-center gap-2 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold tracking-tight">Dir-Khir</span>
              </Link>
              <nav className="flex flex-col gap-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-base">
                    Home
                  </Button>
                </Link>

                {isLoggedIn && (
                  <Link href="/create" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base">
                      Add Help
                    </Button>
                  </Link>
                )}

                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-base"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base">
                      Login / Register
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
