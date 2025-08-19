import React from "react";

export type StepperProps = {
    totalSteps: number;
    currentStep: number;
    labelPrefix?: string;
    className?: string;
};

export function Stepper({
    totalSteps,
    currentStep,
    labelPrefix = "Step",
    className = "",
}: StepperProps) {
    const total = Math.max(1, Math.floor(totalSteps || 1));

    // clamp to [1, total] but allow > total for completed
    const isCompleted = currentStep > total;
    const current = Math.min(Math.max(1, Math.floor(currentStep || 1)), total);

    const getStepColor = (i: number) => {
        if (isCompleted) return "var(--theme-success)"; // completed state → all green
        if (i < current) return "var(--theme-success)"; // past
        if (i === current) return "var(--gray-warm-500)"; // current
        return "var(--gray-warm-300)"; // upcoming
    };

    return (
        <nav aria-label="Progress" className={`inline-flex items-center ${className}`}>
            <ul className="flex items-center gap-[4px]" aria-hidden="true">
                {Array.from({ length: total }).map((_, idx) => {
                    const stepIndex = idx + 1;
                    const color = getStepColor(stepIndex);
                    const isCurrent = stepIndex === current && !isCompleted;
                    return (
                        <li key={stepIndex}>
                            <span
                                aria-current={isCurrent ? "step" : undefined}
                                className="block w-[24px] h-[8px] rounded-[50px]"
                                style={{ backgroundColor: color }}
                            />
                        </li>
                    );
                })}
            </ul>

            <span className="ml-[12px] text-[var(--gray-warm-700)] font-normal text-[14px] leading-[100%] tracking-[-0.28px] font-[var(--font-sans,_inherit)]">
                {isCompleted ? "Completed" : `${labelPrefix} ${current} of ${total}`}
            </span>

            <span className="sr-only">
                {isCompleted ? "Completed" : `${labelPrefix} ${current} of ${total}`}
            </span>
        </nav>
    );
}

export default Stepper;
