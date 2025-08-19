// components/Radio.tsx
import { cn } from "@/lib/utils";
import * as React from "react";

type RadioProps = {
    id: string;
    name: string;
    value: string;
    label: React.ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
    // Optional state flags
    error?: boolean;
};

export function Radio({
    id,
    name,
    value,
    label,
    checked,
    defaultChecked,
    onChange,
    disabled,
    className,
    error,
}: RadioProps) {
    const handleLabelClick = () => {
        if (!disabled && onChange) {
            // Create a synthetic event to trigger onChange
            const syntheticEvent = {
                target: { value, checked: !checked }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };

    return (
        <label
            htmlFor={id}
            onClick={handleLabelClick}
            className={cn(
                "inline-flex items-center gap-3 select-none",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                className
            )}
        >
            {/* Native input (accessible) */}
            <input
                id={id}
                name={name}
                type="radio"
                value={value}
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
                className="peer sr-only"
                aria-invalid={error || undefined}
            />

            {/* Icon container with focus ring */}
            <span
                aria-hidden
                className={cn(
                    "grid place-items-center w-5 h-5 rounded-full",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                    error
                        ? "peer-focus-visible:outline-red-500"
                        : "peer-focus-visible:outline-violet-500"
                )}
            >
                {/* Unchecked SVG */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={checked ? "hidden" : "block"}
                >
                    <g clipPath="url(#clip0_1_669)">
                        <circle cx="10" cy="10" r="9.5" stroke="#62605C" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1_669">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                {/* Checked SVG */} 
                <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={checked ? "block" : "hidden"}
                >
                    <g clipPath="url(#clip0_1_1874)">
                        <circle cx="10" cy="10.5" r="6.5" stroke="#41403D" strokeWidth="7" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1_1874">
                            <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                    </defs>
                </svg>
            </span>

            {/* Label text (DM Sans, 16px, 500, tracking -0.8px, color #62605C) */}
            <span className="text-[#62605C] font-sans text-[16px] font-medium tracking-[-0.8px] leading-none">
                {label}
            </span>
        </label>
    );
}
