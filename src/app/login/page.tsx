"use client"

import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { signIn, useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  /*
  // Client-side redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])
  */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
        onError: (ctx) => {
          setIsLoading(false)
          alert(ctx.error.message)
        }
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="mt-2 w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
