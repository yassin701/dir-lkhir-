import * as React from "react"

import { cn } from "@/lib/utils"

function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }) {
    const variants = {
        default: "border-emerald-400 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-semibold",
        secondary: "border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 font-semibold",
        destructive: "border-red-400 bg-red-100 text-red-900 hover:bg-red-200 font-semibold",
        outline: "text-emerald-900 border-emerald-500 hover:bg-emerald-50",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
