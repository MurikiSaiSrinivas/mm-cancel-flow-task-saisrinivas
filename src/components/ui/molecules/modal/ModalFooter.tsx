import { cn } from "@/lib/utils";

type ModalFooterProps = {
    children: React.ReactNode; // your buttons
    className?: string;
    sticky?: boolean;
};
export function ModalFooter({ children, className, sticky = true }: ModalFooterProps) {
    return (
        <div
            className={cn(
                "border-t border-gray-200",
                sticky ? "sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75" : "",
                "px-5 py-4"
            )}
        >
            <div className={cn("flex items-center justify-end gap-3", className)}>{children}</div>
        </div>
    );
}
