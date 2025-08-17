// components/ui/Button.tsx
"use client";

import { cn } from "@/lib/utils";

interface CTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

export function CTA({
    children,
    className,
    variant = "primary",
    loading,
    ...props
}: CTAProps) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={cn(
                // base styles
                "inline-flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm",
                // color variants
                variant === "primary" &&
                "bg-[#8952fc] text-white hover:bg-[#7b40fc] transition-colors",
                variant === "secondary" &&
                "border-2 border-[#E6E6E6] text-[#62605C] hover:bg-[#E6E6E6] transition-colors",
                variant === "success" &&
                "bg-[#4ABF71] text-white hover:bg-[#3ea360] transition-colors",
                variant === "danger" &&
                "bg-[#DC2626] text-white hover:bg-[#bf2222] transition-colors",//
                // extra classes passed from caller
                className
            )}
        >
            {loading && (
                <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}