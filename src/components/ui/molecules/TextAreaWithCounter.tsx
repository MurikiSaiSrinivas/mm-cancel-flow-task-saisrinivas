"use client";

import React, { useId, useMemo, useState } from "react";

type Props = {
    label?: string;
    placeholder?: string;
    minChars?: number; // default 25
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;

    /** Set true when user pressed submit, to force validation/error state */
    submitted?: boolean;

    /** Optional error text to show in danger state */
    errorText?: string;

    className?: string;
    textareaClassName?: string;
};

export default function TextareaWithCounter({
    label,
    placeholder = "Enter reason here...",
    minChars = 25,
    value,
    defaultValue,
    onChange,
    submitted = false,
    errorText = "Please enter at least 25 characters so we can understand your feedback*",
    className = "",
    textareaClassName = "",
}: Props) {
    const reactId = useId();
    const [internal, setInternal] = useState(defaultValue ?? "");
    const [touched, setTouched] = useState(false);

    const text = value ?? internal;
    const len = text.length;

    const isMinMet = len >= minChars;
    const showDanger = (submitted || touched) && !isMinMet;
    const showSuccess = isMinMet; // success as soon as threshold met

    const borderColor = useMemo(() => {
        if (showDanger) return "border-theme-danger";
        if (showSuccess) return "border-theme-success";
        return "border-gray-warm-700";
    }, [showDanger, showSuccess]);

    const counterColor = useMemo(() => {
        if (showDanger) return "text-theme-danger";
        if (showSuccess) return "text-theme-success";
        return "text-gray-warm-700";
    }, [showDanger, showSuccess]);

    return (
        <div className={`w-full ${className}`}>
            {label ? (
                <label
                    htmlFor={reactId}
                    className="mb-2 block text-[14px] font-medium text-gray-warm-800"
                >
                    {label}
                    <span className="text-theme-danger">*</span>
                </label>
            ) : null}

            {/* Error line (matches red example) */}
            {showDanger ? (
                <p className="mb-2 line-height-normal font-[400] text-[16px] tracking-[-0.8px] text-theme-danger">
                    {errorText}
                </p>
            ) : null}

            {/* Wrapper with exact specs */}
            <div
                className={[
                    "relative flex h-[150px] items-end justify-end gap-[10px] self-stretch rounded-[8px] p-[12px]",
                    "bg-white",
                    borderColor,
                    "border",
                ].join(" ")}
            >
                {/* The textarea itself fills the box, uses transparent bg, no default outline */}
                <textarea
                    id={reactId}
                    value={text}
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e.target.value);
                        } else {
                            setInternal(e.target.value);
                        }
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder={placeholder}
                    className={[
                        "absolute inset-[12px] rounded-[6px] bg-transparent outline-none",
                        "text-[14px] leading-[1.4] text-gray-warm-800 font-normal",
                        "placeholder:text-gray-warm-500",
                        "resize-none", // lock height to 150px
                        textareaClassName,
                    ].join(" ")}
                />

                {/* Counter in bottom-right */}
                <span
                    className={[
                        "relative z-[1] self-end text-right font-dm-sans",
                        "text-[12px] font-normal leading-none tracking-[-0.6px]",
                        counterColor,
                    ].join(" ")}
                >
                    Min {minChars} characters ({len}/{minChars})
                </span>
            </div>
        </div>
    );
}
