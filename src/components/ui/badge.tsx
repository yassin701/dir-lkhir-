import * as React from "react"

import { cn } from "@/lib/utils"

function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }) {
    const variants = {
        default: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 font-semibold",
        secondary: "border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/15 font-semibold",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 font-semibold",
        outline: "text-foreground border-primary/40 hover:bg-primary/5",
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
