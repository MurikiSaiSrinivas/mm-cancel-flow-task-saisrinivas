import React from "react";

type Option = { label: string; value: string; disabled?: boolean };

type Props = {
    options: Option[];
    /** controlled value */
    value: string;
    /** called when a new value is selected */
    onChange: (value: string) => void;
    /** optional class override for the container */
    className?: string;
};

export default function SegmentedControl({ options, value, onChange, className = "" }: Props) {
    const currentIndex = Math.max(0, options.findIndex(o => o.value === value));

    // keyboard support (left/right)
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        let idx = currentIndex;
        for (let i = 0; i < options.length; i++) {
            idx = (idx + dir + options.length) % options.length;
            if (!options[idx].disabled) break;
        }
        onChange(options[idx].value);
    };

    return (
        <div
            role="radiogroup"
            aria-label="Segmented control"
            onKeyDown={onKeyDown}
            className={[
                "flex gap-2 w-full", // container spacing
                className,
            ].join(" ")}
        >
            {options.map((opt) => {
                const selected = opt.value === value;
                const base =
                    "flex-1 flex items-center justify-center gap-[10px] px-6 py-3 rounded-[4px] select-none transition-colors";
                const unselected =
                    "bg-gray-warm-200 text-gray-warm-700";
                const selectedCls =
                    "bg-brand-migrate-mate text-white";
                const disabledCls =
                    "opacity-60 cursor-not-allowed";

                return (
                    <button
                        key={opt.value}
                        role="radio"
                        aria-checked={selected}
                        aria-disabled={opt.disabled || undefined}
                        disabled={opt.disabled}
                        onClick={() => !opt.disabled && onChange(opt.value)}
                        className={[
                            base,
                            selected ? selectedCls : unselected,
                            opt.disabled ? disabledCls : "hover:opacity-95 active:opacity-90",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-migrate-mate/60",
                        ].join(" ")}
                    >
                        {/* label text */}
                        <span className="font-dm-sans text-[14px] font-normal leading-[100%] tracking-[-0.28px]">
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
