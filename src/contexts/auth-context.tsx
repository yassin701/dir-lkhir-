"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession, signOut } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isLoggedIn: boolean
    user: any
    logout: () => Promise<void>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const isLoggedIn = !!session?.user
    const user = session?.user ?? null

    const logout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                },
            },
        })
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, logout, isLoading: isPending }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
