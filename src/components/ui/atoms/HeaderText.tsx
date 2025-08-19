import { cn } from "@/lib/utils"

export default function HeaderText({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("self-stretch text-[var(--gray-warm-800)] font-sans font-semibold leading-normal text-[36px] md:text-[36px] md:tracking-[-1.08px] text-[24px] tracking-[-1.2px]", className)}>
            {children}
        </div>
    );
}