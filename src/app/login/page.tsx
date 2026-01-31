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

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-gradient-to-b from-emerald-50 via-white to-amber-50">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-amber-700 bg-clip-text mt-9 text-transparent">
              Bienvenue
            </h1>
            <p className="text-emerald-700">
              Connectez-vous pour accéder à votre compte et aider votre communauté
            </p>
          </div>

          {/* Login Card */}
          <Card className="border border-emerald-200 shadow-xl bg-white">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-emerald-900">
                    Adresse E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
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
                    <Label htmlFor="password" className="text-sm font-semibold text-emerald-900">
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      {showPassword ? "Cacher" : "Afficher"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
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
                        <EyeOff className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 gap-2 bg-gradient-to-r from-emerald-700 to-amber-600 hover:from-emerald-800 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-emerald-600">Nouveau sur Dir-Khir?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-2 border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-900"
                  >
                    Créer un compte
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-emerald-700">
                  En continuant, vous acceptez nos{" "}
                  <Link href="/terms" className="text-emerald-700 hover:text-emerald-900 font-medium">
                    Conditions
                  </Link>{" "}
                  et{" "}
                  <Link href="/privacy" className="text-emerald-700 hover:text-emerald-900 font-medium">
                    Politique de confidentialité
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