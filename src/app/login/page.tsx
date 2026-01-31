"use client"

import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn, useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          toast.success("Welcome back!", {
            description: "You have successfully logged in.",
          })
          router.push("/")
          router.refresh()
        },
        onError: (ctx) => {
          setIsLoading(false)
          toast.error("Login failed", {
            description: ctx.error.message || "Please check your credentials and try again.",
          })
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-10">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text mt-9 text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your account and help your community
            </p>
          </div>

          {/* Login Card */}
          <Card className="border border-gray-200 shadow-xl">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="pl-10 h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="pl-10 h-11"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">New to Community Aid?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  >
                    Create New Account
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-gray-600">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          
        </div>
      </main>
    </div>
  )
}