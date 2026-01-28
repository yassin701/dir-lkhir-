"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";

export default function InputPasswordContainer({
    children,
}: {
    children: React.ReactElement; // Expecting a single React Element (the Input)
}) {
    const [showPassword, setShowPassword] = useState(false);

    // Clone the child input to override its type prop
    const input = React.cloneElement(children as React.ReactElement<any>, {
        type: showPassword ? "text" : "password",
    });

    return (
        <div className="relative">
            {input}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground transition-all hover:bg-transparent hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? (
                    <EyeIcon className="size-4" aria-hidden="true" />
                ) : (
                    <EyeOffIcon className="size-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                </span>
            </Button>
        </div>
    );
}
