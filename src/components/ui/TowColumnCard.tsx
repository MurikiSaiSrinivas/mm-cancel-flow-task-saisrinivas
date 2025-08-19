// components/cards/TwoColumnCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type Actions = React.ReactNode;
type Banner = React.ReactNode;

type TwoColumnCardProps = {
    /** Optional image on the right (hidden on mobile if not provided) */
    imageUrl?: string;
    /** Content block on the left */
    children: React.ReactNode;
    /** CTA block below left content (keeps mobile “sticky-ish” shadow) */
    actions?: Actions;
    /** Optional block under the heading (e.g., purple offer banner) */
    banner?: Banner;
    /** Tailwind extras */
    className?: string;
    /** If true, the image will be shown on mobile */
    needImageInMobile?: boolean;
};

export function TwoColumnCard({
    imageUrl,
    children,
    actions,
    banner,
    className,
    needImageInMobile = true,
}: TwoColumnCardProps) {
    return (
        <section
            className={cn(
                "flex w-[1000px] max-w-full flex-col items-start justify-center",
                className
            )}
            role="region"
        >
            {/* row (desktop) / column (mobile) */}
            <div
                className={[
                    "flex items-center justify-center gap-5 self-stretch",
                    "max-md:flex-col max-md:justify-between max-md:items-start",
                ].join(" ")}
            >
                {/* Right image (first on mobile) */}
                {imageUrl ? (
                    <div
                        className={[
                            "md:order-2 order-1",
                            "w-[400px] self-stretch rounded-[12px] border-t-2 border-white/30",
                            "max-md:h-[122px] max-md:rounded-[8px] max-md:mx-3 max-md:w-auto",
                            needImageInMobile ? "max-md:block" : "max-md:hidden",
                        ].join(" ")}
                        style={{
                            background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
                            boxShadow: "inset 0 -6px 4px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)",
                        }}
                        aria-hidden
                    />
                ) : null}

                {/* Left content */}
                <div
                    className={[
                        imageUrl ? "md:order-1 order-2" : "order-1",
                        "flex flex-col items-start gap-5 flex-[1_0_0] self-stretch",
                        "max-md:px-3",
                    ].join(" ")}
                >

                    {/* main copy (you pass headings/paragraphs) */}
                    <div className="w-full flex flex-col gap-3">{children}</div>

                    {banner ? <div className="w-full">{banner}</div> : null}

                    {/* divider */}
                    <hr className="h-0 self-stretch border-0 border-t border-gray-warm-300" />

                    {/* actions */}
                    {actions ? (
                        <div
                            className={[
                                "flex flex-col items-center gap-2 self-stretch",
                                "md:p-0"
                            ].join(" ")}
                        >
                            {actions}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
