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
                "inline-flex items-center justify-center w-full px-4 py-3 rounded-lg text-md not-italic font-semibold leading-[100%] tracking-[-0.32px]",
                // color variants
                variant === "primary" &&
                "bg-[var(--brand-migrate-mate)] text-white hover:bg-[var(--brand-purple-1)] transition-colors",
                variant === "secondary" &&
                "border-2 border-[var(--gray-warm-300)] text-[var(--gray-warm-700)] hover:bg-[var(--gray-warm-300)] transition-colors",
                variant === "success" &&
                "bg-[var(--theme-success)] text-white hover:bg-[var(--theme-success-1)] transition-colors",
                variant === "danger" &&
                "bg-[var(--theme-danger)] text-white hover:bg-[var(--theme-danger-1)] transition-colors",
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