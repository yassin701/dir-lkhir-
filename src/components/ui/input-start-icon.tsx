import { LucideIcon } from "lucide-react";
import React from "react";

export default function InputStartIcon({
    icon: Icon,
    children,
}: {
    icon: LucideIcon;
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
                <Icon className="size-4" />
            </div>
            {children}
        </div>
    );
}
