import * as React from "react";
import { cn } from "@/lib/utils";

type ModalHeaderProps = {
    title: React.ReactNode;        // required
    onClose: () => void;           // required
    onBack?: () => void;           // optional
    stepper?: React.ReactNode;     // optional
    className?: string;
};

export function ModalHeader({
    title,
    onClose,
    onBack,
    stepper,
    className,
}: ModalHeaderProps) {
    return (
        <div
            className={cn(
                "relative w-full h-[60px] border-b border-[#E6E6E6] bg-white rounded-t-2xl",
                // Responsive layout: mobile vs tablet/desktop
                "flex items-center justify-start md:flex md:items-center md:justify-center font-sans",
                className
            )}
        >
            {/* Back button (only shows from md: up) */}
            {onBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    className="absolute left-5 bottom-[17.5px] hidden md:inline-flex items-end gap-2 align-center font-sans cursor-pointer"
                    aria-label="Back"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15 6L9 12L15 18"
                            stroke="#41403D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="text-[#62605C] font-sans text-[16px] font-semibold leading-none">
                        Back
                    </span>
                </button>
            ) : null}

            {/* Title + Stepper (12px gap) */}
            <div className="flex items-start justify-center gap-[12px] flex-col justify-start pl-[32px] md:flex-row md:justify-center md:pl-0 ">
                <h2 className="text-[#41403D] text-[16px] font-sans font-semibold leading-none text-center">
                    {title}
                </h2>
                {stepper ? <div className="shrink-0">{stepper}</div> : null}
            </div>

            {/* Close button */}
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-1/2 -translate-y-1/2 inline-grid place-items-center w-6 h-6 cursor-pointer"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6L18 18M18 6L6 18" stroke="#41403D" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
}