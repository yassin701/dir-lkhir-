"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart, LogOut, Home, PlusCircle, MapPin, BarChart3 } from "lucide-react"
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/90 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md group-hover:shadow-lg transition-all duration-300">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
              Community Aid
            </span>
            <span className="text-xs font-medium text-gray-600">Neighbors Helping Neighbors</span>
          </div>
          <span className="sm:hidden text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
            Community Aid
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>

          {isLoggedIn && (
            <>
              <Link href="/create">
                <Button variant="ghost" className="gap-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">
                  <PlusCircle className="h-4 w-4" />
                  Share Need
                </Button>
              </Link>
              <Link href="/mon-espace">
                <Button variant="ghost" className="gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50">
                  <BarChart3 className="h-4 w-4" />
                  My Dashboard
                </Button>
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md">
                <Heart className="h-4 w-4" />
                Join Now
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] border-l border-gray-200">
            <div className="flex flex-col gap-6 pt-8">
              {/* Mobile Logo */}
              <Link href="/" className="flex items-center gap-3 pb-4 border-b border-gray-100" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                    Community Aid
                  </span>
                  <span className="text-xs text-gray-600">Helping Together</span>
                </div>
              </Link>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 text-gray-700 hover:bg-gray-100">
                    <Home className="h-5 w-5" />
                    Home
                  </Button>
                </Link>

                {isLoggedIn && (
                  <>
                    <Link href="/create" onClick={() => setIsOpen(false)}>
                    <Link href="/mon-espace" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                        <BarChart3 className="h-5 w-5" />
                        My Dashboard
                      </Button>
                    </Link>   <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 text-gray-700 hover:bg-green-50 hover:text-green-700">
                        <PlusCircle className="h-5 w-5" />
                        Share Need
                      </Button>
                    </Link>
                   
                  </>
                )}

                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-base h-12 text-gray-700 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <Heart className="h-5 w-5" />
                      Login / Register
                    </Button>
                  </Link>
                )}
              </nav>

              {/* User Info (if logged in) */}
              {isLoggedIn && session?.user && (
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}