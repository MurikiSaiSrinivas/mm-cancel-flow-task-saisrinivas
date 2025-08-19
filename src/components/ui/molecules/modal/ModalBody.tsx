import { cn } from "@/lib/utils";

type ModalBodyProps = {
    children: React.ReactNode;
    className?: string;
    padded?: boolean;
};
export function ModalBody({ children, className, padded = true }: ModalBodyProps) {
    return (
        <div className={cn("overflow-auto", padded && "p-5", className)}>
            {children}
        </div>
    );
}