"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface GenderRadioGroupProps {
    value: boolean; // false = male, true = female
    onChange: (value: boolean) => void;
    className?: string;
}

export function GenderRadioGroup({
    value,
    onChange,
    className,
}: GenderRadioGroupProps) {
    return (
        <RadioGroup
            value={value ? "female" : "male"}
            onValueChange={(val) => onChange(val === "female")}
            className={cn("flex gap-4", className)}
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
            </div>
        </RadioGroup>
    );
}
