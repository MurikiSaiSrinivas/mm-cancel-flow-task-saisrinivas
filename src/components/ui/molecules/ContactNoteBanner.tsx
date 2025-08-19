import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
    avatarUrl: string;
    name: string;
    email: string;
    /** First line (Inter 16 / 600) */
    lineStrong: React.ReactNode | string;
    /** Second line (Inter 16 / 400) */
    lineBody: React.ReactNode | string;
    /** Third line (Inter 16 / 500) */
    lineEmphasis: React.ReactNode | string;
    className?: string;
};

export default function ContactNoteBanner({
    avatarUrl,
    name,
    email,
    lineStrong,
    lineBody,
    lineEmphasis,
    className = "",
}: Props) {

    return (
        <section
            className={cn(
                // container
                "flex flex-col items-start gap-2 self-stretch rounded-[8px] bg-gray-warm-200 p-4",
                className
            )}
            aria-label={`${name} message`}
        >
            {/* top row: avatar + id */}
            <div className="flex items-center gap-3">
                <div
                    className="h-12 w-12 rounded-full bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${avatarUrl})`,
                        backgroundSize: "contain",
                    }}
                    role="img"
                    aria-label={`${name} avatar`}
                />
                <div className="flex flex-col items-start gap-1">
                    <div className="text-gray-warm-800 font-sans text-[14px] font-[600] leading-[100%] tracking-[-0.28px]">
                        {name}
                    </div>
                    <div className="text-gray-warm-700 font-sans text-[14px] font-[400] leading-[100%] tracking-[-0.28px]">
                        &lt;{email}&gt;
                    </div>
                </div>
            </div>

            {/* bottom text block (md: indent to align with avatar) */}
            <div className="flex items-center gap-2 self-stretch md:pl-[60px]">
                <div className="space-y-3">
                    <p className="text-gray-warm-700 font-inter text-[16px] font-[600] tracking-[-0.8px]">
                        {lineStrong}
                    </p>

                    <p className="text-gray-warm-700 font-inter text-[16px] font-[400] tracking-[-0.8px]">
                        {lineBody}
                    </p>

                    <p className="text-gray-warm-700 font-inter text-[16px] font-[500] tracking-[-0.8px]">
                        {lineEmphasis}
                    </p>
                </div>
            </div>
        </section>
    );
}
