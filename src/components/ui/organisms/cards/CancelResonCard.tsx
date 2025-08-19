import * as React from "react";
import { TwoColumnCard } from "@/components/ui/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";
import TextInput from "@/components/ui/atoms/TextInput";
import TextareaWithCounter from "@/components/ui/molecules/TextAreaWithCounter";
import { Radio } from "@/components/ui/atoms/Radio";

type Reason =
    | "too_expensive"
    | "not_helpful"
    | "not_relevant"
    | "not_moving"
    | "other"
    | "";

const REASONS: { label: string; value: Exclude<Reason, "">; id: string }[] = [
    { label: "Too expensive", value: "too_expensive", id: "too_expensive" },
    { label: "Platform not helpful", value: "not_helpful", id: "not_helpful" },
    { label: "Not enough relevant jobs", value: "not_relevant", id: "not_relevant" },
    { label: "Decided not to move", value: "not_moving", id: "not_moving" },
    { label: "Other", value: "other", id: "other" },
];

type Props = {
    imageUrl?: string;
    priceLabel?: string; // "$12.50"
    onAcceptOffer?: () => void;
    onCompleteCancel?: (payload: {
        reason: Exclude<Reason, "">;
        amount?: string;
        details?: string;
    }) => void;
    className?: string;
    initial?: { reason?: Reason; amount?: string; details?: string };
    onChange?: (partial: Partial<{
        reason?: Reason;
        amount?: string;
        details?: string;
    }>) => void;
};

export default function CancelReasonCard({
    imageUrl,
    priceLabel = "$12.50",
    onAcceptOffer,
    onCompleteCancel,
    className = "",
    initial,
    onChange,
}: Props) {
    const [reason, setReason] = React.useState<Reason>(initial?.reason ?? "");
    const [amount, setAmount] = React.useState(initial?.amount ?? "");   // for too_expensive
    const [details, setDetails] = React.useState(initial?.details ?? ""); // for other reasons
    const [submitted, setSubmitted] = React.useState(false);

    const needsAmount = reason === "too_expensive";
    const needsDetails = reason !== "" && reason !== "too_expensive";

    const amountOk = needsAmount ? amount.trim().length > 0 : true;
    const detailsOk = needsDetails ? details.trim().length >= 25 : true;
    const isValid = reason !== "" && amountOk && detailsOk;

    // Outside-click: show error if user clicks anywhere not marked interactive
    const onOutsideClickCapture = (e: React.MouseEvent) => {
        const el = e.target as HTMLElement;
        if (el.closest('[data-interactive="true"]')) return;
        setSubmitted(true);
    };

    const handleComplete = () => {
        if (!isValid) {
            setSubmitted(true);
            return;
        }
        onCompleteCancel?.({
            reason: reason as Exclude<Reason, "">,
            amount: needsAmount ? amount.trim() : undefined,
            details: needsDetails ? details.trim() : undefined,
        });
    };

    // radio group renderer – hides others once chosen
    const renderRadios = () => {
        const groupName = "cancel_reason";
        const list = reason
            ? REASONS.filter(r => r.value === reason) // show only selected
            : REASONS;                                 // initial: show all

        return (
            <div
                className={[
                    submitted && reason === "" ? "ring-1 ring-theme-danger/50 rounded-[8px] p-2" : "",
                    "mt-2 flex flex-col gap-1",
                ].join(" ")}
            >
                {list.map(r => (
                    <div key={r.id} data-interactive="true">
                        <Radio
                            label={r.label}
                            value={r.value}
                            id={r.id}
                            name={groupName}
                            checked={reason === r.value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value as Reason;
                                setReason(value);
                                onChange?.({ reason: value });
                                // clear previous follow-ups when changing reason
                                setAmount("");
                                setDetails("");
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <TwoColumnCard imageUrl={imageUrl} className={className} needImageInMobile={false}
            actions={
                < div data-interactive="true" className="w-full flex flex-col gap-2">
                    <CTA variant="success" className="w-full" onClick={onAcceptOffer}>
                        <span className="text-[14px] md:text-[16px] font-[600]">
                            Get 50% off | {priceLabel}
                        </span>
                        <span className="ml-1 text-[12px] opacity-70 line-through">$25</span>
                    </CTA>

                    <CTA
                        variant={isValid ? "danger" : "secondary"}
                        className="w-full"
                        disabled={!isValid}
                        onClick={handleComplete}
                    >
                        Complete cancellation
                    </CTA>
                </div>
            }
        >
            <div onClickCapture={onOutsideClickCapture} className="contents">
                {/* Heading */}
                <div className="flex flex-col gap-[8px]">
                    <h2 className="text-gray-warm-800 font-sans text-[28px] md:text-[36px] font-[600] leading-[1.1] tracking-[-0.03em]">
                        What’s the main <br className="md:hidden" />
                        reason for cancelling?
                    </h2>
                    <p className="text-gray-warm-700 text-[12px] md:text-[14px]">
                        Please take a minute to let us know why:
                    </p>

                    {submitted && reason === "" && (
                        <p className="text-theme-danger text-[12px] md:text-[14px] tracking-[-0.6px]">
                            To help us understand your experience, please select a reason for cancelling*
                        </p>
                    )}
                </div>

                {/* Radio group (uses your Radio component / hides others once selected) */}
                {renderRadios()}

                {/* Follow-ups */}
                <div className="mt-3 flex flex-col gap-2">
                    {needsAmount && (
                        <div data-interactive="true" className="w-full">
                            <p className="mb-2 text-[12px] md:text-[14px] font-[600] text-gray-warm-700">
                                What would be the maximum you would be willing to pay?*
                            </p>
                            <TextInput
                                status={!submitted || amountOk ? "default" : "danger"}
                                placeholder="$"
                                value={amount}
                                onChange={(v) => { setAmount(v); onChange?.({ amount: v }); }}
                                leftIcon={<span className="text-gray-warm-700 text-[14px]">$</span>}
                            />
                            {!amountOk && submitted && (
                                <p className="mt-1 text-[12px] text-theme-danger tracking-[-0.6px]">
                                    Please enter an amount.
                                </p>
                            )}
                        </div>
                    )}

                    {needsDetails && (
                        <div data-interactive="true" className="w-full">
                            <p className="mb-2 text-[12px] md:text-[14px] font-[600] text-gray-warm-700">
                                {reason === "not_helpful" && "What can we change to make the platform more helpful?*"}
                                {reason === "not_relevant" && "In which way can we make the jobs more relevant?*"}
                                {reason === "not_moving" && "What changed for you to decide to not move?*"}
                                {reason === "other" && "What would have helped you the most?*"}
                            </p>
                            <TextareaWithCounter
                                minChars={25}
                                value={details}
                                onChange={(v) => { setDetails(v); onChange?.({ details: v }); }}
                                submitted={submitted}
                                errorText="Please enter at least 25 characters so we can understand your feedback*"
                            />
                        </div>
                    )}
                </div>


            </div>
        </TwoColumnCard >
    );
}
