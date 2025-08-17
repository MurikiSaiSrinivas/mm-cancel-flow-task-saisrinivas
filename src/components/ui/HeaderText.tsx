export default function HeaderText({ children }: { children: React.ReactNode }) {
    return (
        <span className="self-stretch text-[var(--gray-warm-800)] text-[36px] italic font-semibold leading-normal tracking-[-0.027em]">
            {children}
        </span>
    );
}