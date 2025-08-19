import * as React from "react";
import { TwoColumnCard } from "@/components/ui/TowColumnCard";
import { Radio } from "@/components/ui/atoms/Radio";
import TextInput from "@/components/ui/atoms/TextInput";
import { CTA } from "@/components/ui/atoms/CTA";
import { cn } from "@/lib/utils";

type Props = {
    variant?: "withMM" | "notWithMM";
    imageUrl?: string;
    onCompleteCancel?: (payload: { hasLawyer: "yes" | "no"; visa: string }) => void;
    className?: string;
    initial?: { hasLawyer?: "yes" | "no"; visa?: string };
    onChange?: (partial: Partial<{
        hasLawyer?: "yes" | "no";
        visa?: string;
    }>) => void;
};

export default function VisaSupportCard({
    variant = "withMM",
    imageUrl,
    onCompleteCancel,
    className = "",
    initial,
    onChange,
}: Props) {
    const [answer, setAnswer] = React.useState<"" | "yes" | "no">(initial?.hasLawyer ?? "");
    const [visa, setVisa] = React.useState(initial?.visa ?? "");
    const [submitted, setSubmitted] = React.useState(false);

    const hasSelection = answer !== "";
    const visaRequired = hasSelection; // both Yes and No require visa input in mocks
    const visaOk = !visaRequired || visa.trim().length > 0;
    const isValid = hasSelection && visaOk;

    // outside click => show errors (but ignore interactive regions)
    const onOutsideClickCapture = (e: React.MouseEvent) => {
        const el = e.target as HTMLElement;
        if (el.closest('[data-interactive="true"]')) return;
        setSubmitted(true);
    };

    const handleComplete = () => {
        console.log("handleComplete", { hasLawyer: answer, visa: visa.trim() });
        if (!isValid) {
            setSubmitted(true);
            return;
        }
        onCompleteCancel?.({ hasLawyer: answer as "yes" | "no", visa: visa.trim() });
    };

    // labels per selection
    const visaLabel =
        answer === "yes"
            ? "What visa will you be applying for?*"
            : "Which visa would you like to apply for?*";

    const helperWhenNo =
        answer === "no"
            ? "We can connect you with one of our trusted partners."
            : "";

    return (
        <TwoColumnCard imageUrl={imageUrl} className={className}
            needImageInMobile={false}
            actions={
                <div data-interactive="true" className="w-full">
                    <CTA
                        variant="primary"
                        className="w-full"
                        disabled={!isValid}
                        onClick={handleComplete}
                    >
                        Complete cancellation
                    </CTA>
                </div>
            }>
            <div onClickCapture={onOutsideClickCapture} className="contents">
                {/* Heading */}
                <div className="flex flex-col gap-[20px] flex-1 max-md:gap-[16px]">
                    <h2
                        className={[
                            "text-gray-warm-800 font-sans font-[600]",
                            // tab/desktop
                            "text-[36px] leading-[36px] tracking-[-1.08px]",
                            // mobile
                            "max-md:text-[24px] max-md:leading-[1] max-md:tracking-[-1.2px]",
                        ].join(" ")}
                    >
                        {variant === "withMM" ? (
                            "We helped you land the job, now let's help you secure your visa."
                        ) : (
                            <>
                                You landed the job! <br />
                                That&apos;s what we live for.
                            </>
                        )}
                    </h2>

                    {/* Extra text for notWithMM variant */}
                    {variant === "notWithMM" && (
                        <p
                            className={[
                                "text-gray-warm-800 font-sans text-[20px] font-[600] leading-normal tracking-[-1px]",
                                "max-md:text-[18px] max-md:tracking-[-0.8px]",
                            ].join(" ")}
                        >
                            Even if it wasn&apos;t through Migrate Mate, <br />
                            let us help get your visa sorted.
                        </p>
                    )}

                    {/* Question prompt */}
                    <p
                        className={[
                            "text-gray-warm-700 font-sans",
                            // 16 / 600 at all sizes (per spec)
                            "text-[16px] font-[600] tracking-[-0.8px]",
                        ].join(" ")}
                    >
                        Is your company providing an immigration lawyer to help with your visa?*
                    </p>

                    {/* Radios */}
                    <div
                        className={[
                            submitted && !hasSelection ? "ring-1 ring-theme-danger/50 rounded-[8px] p-2" : "",
                            "flex flex-col gap-2",
                        ].join(" ")}
                    >
                        <div data-interactive="true">
                            <Radio
                                label="Yes"
                                value="yes"
                                id="visa_yes"
                                name="visa_lawyer"
                                checked={answer === "yes"}
                                onChange={(e) => {
                                    const value = e.target.value as "yes";
                                    setAnswer(value);
                                    onChange?.({ hasLawyer: value, visa: "" });
                                    setVisa(""); // clear previous value if toggling
                                }}
                                className={cn(answer === "no" && "!hidden")}
                            />
                        </div>
                        <div data-interactive="true">
                            <Radio
                                label="No"
                                value="no"
                                id="visa_no"
                                name="visa_lawyer"
                                checked={answer === "no"}
                                onChange={(e) => {
                                    const value = e.target.value as "no";
                                    setAnswer(value);
                                    onChange?.({ hasLawyer: value, visa: "" });
                                    setVisa("");
                                }}
                                className={cn(answer === "yes" && "!hidden")}
                            />
                        </div>
                    </div>

                    {/* Follow-up (only after selection) */}
                    {hasSelection && (
                        <div className="flex flex-col gap-2">

                            <p className="text-gray-warm-700 font-sans text-[16px] font-[600] tracking-[-0.8px]">
                                <span className={cn(helperWhenNo === "" && "!hidden")}>
                                    {helperWhenNo} <br></br>
                                </span>
                                {visaLabel}
                            </p>


                            {/* <p className="text-gray-warm-700 font-sans text-[16px] font-[600] tracking-[-0.8px]">
                                {visaLabel}
                            </p> */}

                            <div data-interactive="true">
                                <TextInput
                                    placeholder="Enter visa type..."
                                    value={visa}
                                    onChange={(v) => { setVisa(v); onChange?.({ hasLawyer: answer, visa: v }); }}
                                    status={!submitted || visaOk ? "default" : "danger"}
                                />
                                {submitted && !visaOk && (
                                    <p className="mt-1 text-[12px] text-theme-danger tracking-[-0.6px]">
                                        Please enter the visa type.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TwoColumnCard>
    );
}
