import * as React from "react";
import { TwoColumnCard } from "@/components/ui/features/cancelflow/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";
import TextareaWithCounter from "@/components/ui/molecules/TextAreaWithCounter";

type Props = {
    imageUrl?: string;
    minChars?: number;                 // default 25
    onContinue?: (value: string) => void;
    className?: string;
    initialValue?: string;
};

export default function FeedbackWishCard({
    imageUrl,
    minChars = 25,
    onContinue,
    className = "",
    initialValue,
}: Props) {
    const [value, setValue] = React.useState(initialValue ?? "");

    const isValid = value.trim().length >= minChars;

    return (
        <TwoColumnCard imageUrl={imageUrl} className={className}
            needImageInMobile={false}
            actions={
                <CTA
                    variant="primary"
                    className="w-full"
                    disabled={!isValid}
                    onClick={() => isValid && onContinue?.(value.trim())}
                >
                    Continue
                </CTA>
            }>
            {/* Column (tab/desktop) / stack (mobile) */}
            <div className="flex flex-col gap-[20px] max-md:gap-[16px] flex-1">
                {/* Heading */}
                <h2
                    className={[
                        // desktop/tab
                        "text-gray-warm-800 font-sans font-[600] tracking-[-1.08px]",
                        "text-[36px] leading-[36px]",
                        // mobile overrides
                        "max-md:text-[24px] max-md:leading-[1] max-md:tracking-[-1.2px]",
                    ].join(" ")}
                >
                    What’s one thing you wish we could’ve helped you with?
                </h2>

                {/* Mobile divider */}
                <hr className="hidden max-md:block h-0 self-stretch border-0 border-t border-gray-warm-300" />

                {/* Subtext */}
                <p
                    className={[
                        "text-gray-warm-800 font-sans",
                        // tab/desktop spec: 16 / 400
                        "text-[16px] font-[400] tracking-[-0.8px]",
                        // mobile spec says 16 / 600
                        "max-md:font-[600]",
                    ].join(" ")}
                >
                    We’re always looking to improve, your thoughts can help us
                    make Migrate Mate more useful for others.*
                </p>

                {/* Textarea with counter */}
                <TextareaWithCounter
                    minChars={minChars}
                    value={value}
                    onChange={setValue}
                    submitted={false}
                    errorText={!isValid ? "Please enter at least 25 characters" : undefined}
                />

            </div>
        </TwoColumnCard>
    );
}
