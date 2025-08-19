import * as React from "react";
import { TwoColumnCard } from "@/components/ui/TowColumnCard";
import SegmentedControl from "@/components/ui/molecules/SegmentedControl";
import { CTA } from "@/components/ui/atoms/CTA";
import { cn } from "@/lib/utils";
import { SurveyState } from "@/store/cancelFlowSlice";

type QuestionOption = { label: string; value: string; disabled?: boolean };

function Question({
    label,
    value,
    onChange,
    options,
}: {
    label: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    options: QuestionOption[];
}) {
    return (
        <div className="flex flex-col gap-2">
            <p
                className={[
                    "text-[12px] md:text-[16px] font-[600]",
                    "text-gray-warm-700",
                ].join(" ")}
            >
                {label}
            </p>

            {/* Mark this as interactive so outside-click detector ignores it */}
            <div
                data-interactive="true"
            >
                <SegmentedControl
                    options={options}
                    value={value}
                    onChange={onChange}
                    className="w-full"
                />
            </div>
        </div>
    );
}

type Props = {
    variant?: "foundJob" | "noJob";
    imageUrl?: string;
    onAcceptOffer?: () => void; // "Get 50% off | $12.50"
    onContinue?: () => void;    // red button when valid
    priceLabel?: string;        // default "$12.50"
    className?: string;
    initial?: SurveyState;
    onChange?: (p: Partial<SurveyState>) => void
};

export default function UsageSurveyCard({
    variant = "noJob",
    imageUrl,
    onAcceptOffer,
    onContinue,
    priceLabel = "$12.50",
    className = "",
    initial,
    onChange,
}: Props) {
    // empty = unanswered
    const [applied, setApplied] = React.useState(initial?.applied ?? "");
    const [emailed, setEmailed] = React.useState(initial?.emailed ?? "");
    const [interviewed, setInterviewed] = React.useState(initial?.interviewed ?? "");
    const [foundWithMigrateMate, setFoundWithMigrateMate] = React.useState(initial?.foundWithMigrateMate ?? "");

    const [submitted, setSubmitted] = React.useState(false);

    // Different validation logic based on variant
    const canContinue = variant === "foundJob"
        ? Boolean(applied && emailed && interviewed && foundWithMigrateMate)
        : Boolean(applied && emailed && interviewed);

    const showFormError = submitted && !canContinue;

    const range4: QuestionOption[] = [
        { label: "0", value: "0" },
        { label: "1 – 5", value: "1-5" },
        { label: "6 – 20", value: "6-20" },
        { label: "20+", value: "20+" },
    ];

    const interviewRange: QuestionOption[] = [
        { label: "0", value: "0" },
        { label: "1 – 2", value: "0-1" },
        { label: "3 – 5", value: "3-5" },
        { label: "5+", value: "5+" },
    ];

    const yesNoOptions: QuestionOption[] = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ];

    // Outside-click handler: if click target isn't inside any [data-interactive="true"], show errors
    const onOutsideClickCapture = (e: React.MouseEvent) => {
        const el = e.target as HTMLElement;
        if (el.closest('[data-interactive="true"]')) return; // ignore interactive regions
        setSubmitted(true);
    };

    const handleContinue = () => {
        // Button is interactive, so it won't trigger outside-click anyway
        if (canContinue) onContinue?.();
        else setSubmitted(true);
    };

    return (
        <TwoColumnCard imageUrl={imageUrl} className={className} needImageInMobile={false}
            actions={
                <div className=" w-full flex flex-col gap-2">
                    {/* Mark CTAs as interactive so outside-click doesn't fire when tapping them */}
                    <div data-interactive="true" className="contents">
                        <CTA variant="success" className={cn("w-full", variant === "foundJob" && "!hidden")} onClick={onAcceptOffer}>
                            <span className="text-[14px] md:text-[16px] font-[600]">
                                Get 50% off | {priceLabel}
                            </span>
                            <span className="ml-1 text-[12px] opacity-70 line-through">$25</span>
                        </CTA>

                        <CTA
                            variant="primary"
                            className="w-full"
                            disabled={!canContinue}
                            onClick={handleContinue}
                        >
                            Continue
                        </CTA>
                    </div>
                </div>
            }>
            {/* Wrap inner content to capture outside clicks */}
            <div onClickCapture={onOutsideClickCapture} className="contents">
                {/* Heading group */}
                <div className="w-full flex flex-col gap-[8px]">
                    <h2 className="text-gray-warm-800 font-sans text-[28px] md:text-[36px] font-[600] leading-[1.1] tracking-[-0.03em]">
                        {variant === "foundJob" ? (
                            "Congrats on the new role! 🎉"
                        ) : (
                            <>Help us understand how you were using <span className="italic">Migrate Mate</span>.</>
                        )}
                    </h2>

                    {showFormError ? (
                        <p className="text-theme-danger text-[12px] md:text-[14px] leading-normal tracking-[-0.6px]">
                            Mind letting us know why you&apos;re cancelling?{" "}
                            <br className="md:hidden" />
                            It helps us understand your experience and improve the platform*
                        </p>
                    ) : null}
                </div>

                {/* Questions */}
                <div className="mt-2 flex flex-col gap-4">
                    {/* Extra question for foundJob variant */}
                    {variant === "foundJob" && (
                        <Question
                            label={<>Did you find this job with MigrateMate?*</>}
                            value={foundWithMigrateMate}
                            onChange={(v) => { setFoundWithMigrateMate(v); onChange?.({ foundWithMigrateMate: v as "yes" | "no" }); }}
                            options={yesNoOptions}
                        />
                    )}

                    <Question
                        label={<>How many roles did you apply for through Migrate Mate?</>}
                        value={applied}
                        onChange={(v) => { setApplied(v); onChange?.({ applied: v }); }}
                        options={range4}
                    />

                    <Question
                        label={
                            <>
                                How many companies did you email <span className="underline">directly</span>?
                            </>
                        }
                        value={emailed}
                        onChange={(v) => { setEmailed(v); onChange?.({ emailed: v }); }}
                        options={range4}
                    />

                    <Question
                        label={
                            <>
                                How many different companies did you <span className="underline">interview</span> with?
                            </>
                        }
                        value={interviewed}
                        onChange={(v) => { setInterviewed(v); onChange?.({ interviewed: v }); }}
                        options={interviewRange}
                    />

                </div>

            </div>
        </TwoColumnCard>
    );
}
