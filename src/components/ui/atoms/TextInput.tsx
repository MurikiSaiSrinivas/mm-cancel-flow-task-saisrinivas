import React from "react";

type Status = "default" | "success" | "danger";

type Props = {
    id?: string;
    label?: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    defaultValue?: string;
    onChange?: (v: string) => void;
    status?: Status; // "default" | "success" | "danger"
    helperText?: string; // shows below the field
    className?: string; // wrapper
    inputClassName?: string; // input element
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};

export default function TextInput({
    id,
    label,
    placeholder,
    type = "text",
    value,
    defaultValue,
    onChange,
    status = "default",
    helperText,
    className = "",
    inputClassName = "",
    leftIcon,
    rightIcon,
}: Props) {
    const border =
        status === "danger"
            ? "border-theme-danger"
            : status === "success"
                ? "border-theme-success"
                : "border-gray-warm-700";

    const helperColor =
        status === "danger"
            ? "text-theme-danger"
            : status === "success"
                ? "text-theme-success"
                : "text-gray-warm-700";

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-[12px] font-medium text-gray-warm-800 tracking-[-0.6px]"
                >
                    {label}
                </label>
            )}

            <div
                className={[
                    // container to match spec
                    "flex h-[40px] items-end justify-end gap-[10px] p-[12px] self-stretch",
                    "rounded-[8px] border bg-white",
                    border,
                    // allow icons
                    "relative",
                    "focus-within:ring-2 focus-within:ring-brand-migrate-mate/30",
                ].join(" ")}
            >
                {/* left icon (optional) */}
                {leftIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={id}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    className={[
                        // fill container
                        "w-full bg-transparent outline-none",
                        // DM Sans 12px, gray/warm/700, tracking -0.6px
                        "font-sans text-[12px] font-normal leading-none tracking-[-0.6px] text-gray-warm-700",
                        // vertical centering inside our 40px box
                        "placeholder:text-gray-warm-500",
                        // if left/right icons present, add padding
                        leftIcon ? "pl-6" : "",
                        rightIcon ? "pr-6" : "",
                        inputClassName,
                    ].join(" ")}
                />

                {/* right icon (optional) */}
                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightIcon}
                    </span>
                )}
            </div>

            {helperText && (
                <p className={`mt-1 text-[12px] leading-none tracking-[-0.6px] ${helperColor}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}
