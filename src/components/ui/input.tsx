import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-emerald-300 file:text-emerald-900 placeholder:text-emerald-400 selection:bg-emerald-700 selection:text-white flex h-10 w-full min-w-0 rounded-lg border-2 bg-white px-4 py-2 text-base text-emerald-900 shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-200 dark:aria-invalid:ring-red-400 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
