import React from "react";
import { TwoColumnCard } from "@/components/ui/features/cancelflow/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";

type Props = {
    imageUrl: string;
    /** e.g. "XX" */
    daysLeft?: string | number;
    /** e.g. "Jan 20, 2026" */
    startDate?: string;
    /** e.g. "$12.50" */
    monthlyPrice?: string;
    /** CTA */
    onPrimary?: () => void;
    primaryLabel?: string;
    className?: string;
};

export default function CancelOfferAcceptedCard({
    imageUrl,
    daysLeft = "XX",
    startDate = "XX date",
    monthlyPrice = "$12.50",
    onPrimary,
    primaryLabel = "Land your dream role",
    className = "",
}: Props) {
    return (
        <TwoColumnCard
            imageUrl={imageUrl}
            className={className}
            actions={
                <CTA
                    variant="primary"
                    className="w-full"
                    onClick={onPrimary}
                >
                    {primaryLabel}
                </CTA>
            }
        >
            <div className="flex flex-col gap-[12px]">
                        <h2 className="text-gray-warm-800 font-sans text-[28px] md:text-[36px] font-[600] leading-[1.1] tracking-[-0.03em]">
                            Great choice, mate!
                        </h2>

                        <p className="text-gray-warm-800 font-sans text-[20px] md:text-[24px] font-[600] leading-[1.2] tracking-[-0.02em]">
                            You’re still on the path to your dream role.{" "}
                            <span className="text-brand-migrate-mate">
                                Let’s make it happen together!
                            </span>
                        </p>
                    </div>

                    {/* Details */}
                    <div className="mt-[12px] space-y-[6px]">
                        <p className="text-gray-warm-700 font-sans text-[14px] md:text-[16px] font-[600] leading-[140%]">
                            You’ve got {daysLeft} days left on your current plan.
                            <br />
                            Starting from {startDate}, your monthly payment will be {monthlyPrice}.
                        </p>

                        <p className="text-gray-warm-700 font-sans text-[12px] italic leading-normal tracking-[-0.6px]">
                            You can cancel anytime before then.
                        </p>
                    </div>
        </TwoColumnCard>
    );
}




// {
//     return (
//         <section
//             className={[
//                 "flex w-[1000px] max-w-full flex-col items-start justify-center rounded-[20px] bg-white",
//                 className,
//             ].join(" ")}
//             role="region"
//             aria-label="Subscription continued"
//         >
//             {/* Content row (md+) / column (mobile) */}
//             <div
//                 className={[
//                     "flex items-center justify-center gap-[20px] self-stretch p-[20px]",
//                     "max-md:flex-col max-md:items-start max-md:justify-between max-md:px-[12px] max-md:pt-[12px] max-md:pb-[16px]",
//                 ].join(" ")}
//             >
//                 {/* Image (first on mobile, right on md+) */}
//                 <div
//                     className={[
//                         "order-1 md:order-2",
//                         "w-[400px] self-stretch rounded-[12px] border-t-2 border-white/30",
//                         "max-md:h-[122px] max-md:w-auto max-md:rounded-[8px]",
//                     ].join(" ")}
//                     style={{
//                         background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
//                         boxShadow:
//                             "inset 0 -6px 4px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)",
//                     }}
//                 />

//                 {/* Left column */}
//                 <div className="order-2 md:order-1 flex flex-col flex-[1_0_0] self-stretch">
//                     {/* Headings */}
                    

//                     {/* Divider */}
//                     <hr className="my-[16px] h-0 self-stretch border-0 border-t border-gray-warm-300" />


//                 </div>
//             </div>
//         </section>
//     );
// }
