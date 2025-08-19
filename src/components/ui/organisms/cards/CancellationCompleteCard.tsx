import * as React from "react";
import { TwoColumnCard } from "@/components/ui/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";
import ContactNoteBanner from "@/components/ui/molecules/ContactNoteBanner";

type Variant = "noHelpVisa" | "helpVisa";

type Props = {
    variant: Variant;
    imageUrl?: string;
    onFinish?: () => void;
    className?: string;

    // contact block (only used in `helpVisa`)
    contact?: {
        avatarUrl: string;
        name: string;
        email: string;
        lineStrong?: string;
        lineBody?: string;
        lineEmphasis?: string;
        underline?: string;
    };
};

export default function CancellationCompleteCard({
    variant,
    imageUrl,
    onFinish,
    className = "",
    contact,
}: Props) {
    const isNoHelpVisa = variant === "noHelpVisa";

    return (
        <TwoColumnCard imageUrl={imageUrl} className={className} needImageInMobile={isNoHelpVisa}
            actions={
                <CTA variant="primary" className="w-full mt-[4px]" onClick={onFinish}>
                    Finish
                </CTA>
            }>
            <div className="flex flex-col gap-[20px] flex-1">
                {/* Title */}
                {isNoHelpVisa ? (
                    <h2
                        className={[
                            "text-gray-warm-800 font-sans font-[600]",
                            // tab / desktop
                            "text-[36px] leading-[36px] tracking-[-1.08px]",
                            // mobile
                            "max-md:text-[24px] max-md:leading-[24px] max-md:tracking-[-1.2px]",
                        ].join(" ")}
                    >
                        All done, your cancellation’s been processed.
                    </h2>
                ) : (
                    <h2
                        className={[
                            "text-gray-warm-800 font-sans font-[600]",
                            "text-[36px] leading-[36px] tracking-[-1.08px]",
                            "max-md:text-[24px] max-md:leading-[24px] max-md:tracking-[-1.2px]",
                        ].join(" ")}
                    >
                        Your cancellation’s all sorted, mate, no more charges.
                    </h2>
                )}

                {/* Body */}
                {isNoHelpVisa ? (
                    <p
                        className={[
                            "text-gray-warm-800 font-sans",
                            // tab/desktop: 20 / 600 ; mobile: 18 / 600
                            "text-[20px] font-[600] tracking-[-1px]",
                            "max-md:text-[18px] max-md:tracking-[-0.9px]",
                        ].join(" ")}
                    >
                        We’re stoked to hear you’ve landed a job and sorted your visa. Big
                        congrats from the team. 🙌
                    </p>
                ) : (
                    <ContactNoteBanner
                        avatarUrl={contact?.avatarUrl ?? "./mihailo-profile.jpeg"}
                        name={contact?.name ?? "Mihailo"}
                        email={contact?.email ?? "mihailo@migrate-mate.com"}
                        lineStrong={
                            contact?.lineStrong ??
                            "I’ll be reaching out soon to help with the visa side of things."
                        }
                        lineBody={
                            contact?.lineBody ??
                            "We’ve got your back, whether it’s questions, paperwork, or just figuring out your options."
                        }
                        lineEmphasis={
                            contact?.lineEmphasis ??
                            <>Keep an eye on your inbox, I’ll be in touch <span className="underline">shortly</span>.</>
                        }
                        className="mt-1"
                    />

                )}
            </div>
        </TwoColumnCard>
    );
}
