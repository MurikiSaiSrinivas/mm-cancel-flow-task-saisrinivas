import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    size?: "sm" | "md" | "lg" | "xl";
    ariaLabel?: string;                 // fallback if no title/label provided
    initialFocusRef?: React.RefObject<HTMLElement>;
    children: React.ReactNode;
};

export function Modal({
    open,
    onClose,
    size = "lg",
    ariaLabel,
    initialFocusRef,
    children,
}: ModalProps) {
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    // Ensure component is mounted on client side
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close on ESC
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Focus handling
    React.useEffect(() => {
        if (!open) return;
        const el = initialFocusRef?.current ?? containerRef.current;
        el?.focus();
    }, [open, initialFocusRef]);

    // Body scroll lock while open
    React.useEffect(() => {
        if (!open) return;
        const { style } = document.documentElement;
        const prev = style.overflow;
        style.overflow = "hidden";
        return () => {
            style.overflow = prev;
        };
    }, [open]);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50" aria-hidden={!open}>
            {/* Backdrop */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={(e) => {
                    if (e.target === overlayRef.current) onClose();
                }}
            />

            {/* Dialog positioning:
          - mobile: flex + items-end → bottom sheet
          - md+: grid + place-items-center → centered dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                className={cn(
                    "absolute inset-0",
                    "flex items-end p-0",            // default (mobile): bottom sheet
                    "md:grid md:place-items-center md:p-4" // md+: centered
                )}
            >
                <div
                    ref={containerRef}
                    tabIndex={-1}
                    className={cn(
                        // shared
                        "w-full bg-white shadow-xl outline-none",
                        "flex flex-col",
                        // mobile: bottom sheet look
                        "rounded-t-2xl rounded-b-none",
                        "md:min-h-auto max-h-[92svh] overflow-auto",
                        // a touch of breathing room from sides on tiny phones
                        "mx-0",
                        // safe area bottom padding for iOS home bar
                        "pb-[env(safe-area-inset-bottom)]",
                        // md+: normal centered card
                        "md:rounded-2xl md:rounded-b-2xl md:pb-0",
                        "md:max-h-[85vh]",
                        size === "sm" && "md:max-w-md",
                        size === "md" && "md:max-w-2xl",
                        size === "lg" && "md:max-w-5xl"
                    )}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
