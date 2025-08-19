/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Modal } from "@/components/ui/molecules/modal/Modal"; // adjust to your alias
import { ModalHeader } from "@/components/ui/molecules/modal/ModalHeader";
import { ModalBody } from "@/components/ui/molecules/modal/ModalBody";
import Stepper from "@/components/ui/molecules/Stepper";

//cards
import CancelCard from "@/components/ui/organisms/cards/CancelCard";
import CancelOfferCard from "@/components/ui/organisms/cards/CancelofferCard";
import UsageSurveyCard from "@/components/ui/organisms/cards/UsageSurveyCard";
import FeedbackWishCard from "@/components/ui/organisms/cards/FeedbackWishCard";
import CancelReasonCard from "@/components/ui/organisms/cards/CancelResonCard";
import VisaSupportCard from "@/components/ui/organisms/cards/VisaSupportedCard";
import CancellationCompleteCard from "@/components/ui/organisms/cards/CancellationCompleteCard";
import SubscriptionCancelledCard from "@/components/ui/organisms/cards/SubscriptionCancelledCard";
import CancelOfferAcceptedCard from "@/components/ui/organisms/cards/CancelOfferAccepted";

// Store
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
    closeModal,
    selectCancel,
    selectStepper,
    setFoundJob,
    acceptOffer,
    setSurvey,
    setWishText,
    setReason,
    setVisa,
    setStep,
} from "../../../../store/cancelFlowSlice";
import { useAssignVariant } from "./hooks/useAssignVariant";
import { useCompleteOnTerminalStep } from "./hooks/useCompleteOnTerminalStep";
import { computeOffer, money } from "./lib";
import { useStartCancellation } from "./hooks/useStartCancellation";


// Money formatter
// const money = (cents?: number) => `$${((cents ?? 0) / 100).toFixed(2)}`;

// // Build a reason string for DB from current Redux state
// function buildReasonFromState(cancel: ReturnType<typeof selectCancel>): string {
//     // If user accepted the downsell offer
//     if (cancel.offerAccepted) {
//         const plan = cancel.planCents ?? 2500;
//         const oldPrice = money(plan);
//         const isB = cancel.abVariant === 'B';
//         const newCents = isB ? Math.max(plan - 1000, 0) : Math.floor(plan / 2);
//         const newPrice = money(newCents);
//         const label = isB ? '$10 off' : '50% off';
//         return `Accepted downsell (${cancel.abVariant ?? 'A'} – ${label}): ${oldPrice} → ${newPrice}.`;
//     }

//     // Found job (visa path terminals)
//     if (cancel.foundJob) {
//         const bits = [
//             cancel.visa?.visa ? `visa=${cancel.visa?.visa}` : null,
//             cancel.visa?.hasLawyer ? `hasLawyer=${cancel.visa?.hasLawyer}` : null,
//             cancel.survey?.foundWithMigrateMate ? `foundWithMM=${cancel.survey?.foundWithMigrateMate}` : null,
//         ].filter(Boolean);
//         const wish = cancel.wishText ? `; wish="${cancel.wishText}"` : '';
//         return `Found job${bits.length ? ' (' + bits.join(', ') + ')' : ''}${wish}`;
//     }

//     // No job (reason card path)
//     if (cancel.reason?.reason) {
//         const map: Record<string, string> = {
//             too_expensive: 'Too expensive',
//             not_helpful: 'Not helpful',
//             not_relevant: 'Not relevant',
//             not_moving: "I'm not moving",
//             other: 'Other',
//         };
//         let base = map[cancel.reason.reason] ?? 'Other';
//         if (cancel.reason.amount) base += `; amount=${cancel.reason.amount}`;
//         if (cancel.reason.details) base += `; details="${cancel.reason.details}"`;
//         return base;
//     }

//     return 'No reason provided';
// }

// // Compute A/B offer copy + prices
// function computeOffer(ab: 'A' | 'B' | undefined, planCents?: number) {
//     const plan = planCents ?? 2500; // fallback $25
//     const headline =
//         ab === 'B'
//             ? 'Stay for $10 less while you search.'
//             : 'Here’s 50% off until you find a job.'; // A or undefined

//     const priceWas = money(plan);
//     const priceNow = ab === 'B' ? money(Math.max(plan - 1000, 0)) : money(Math.floor(plan / 2));
//     return { headline, priceWas, priceNow };
// }


export default function CancelModal() {

    const dispatch = useAppDispatch();
    const cancel = useAppSelector(selectCancel);
    const stepper = useAppSelector(selectStepper);

    useAssignVariant();
    const subId = useStartCancellation();
    useCompleteOnTerminalStep(cancel.step, subId, cancel);

    const { headline, priceWas, priceNow } = React.useMemo(
        () => computeOffer(cancel.abVariant, cancel.planCents),
        [cancel.abVariant, cancel.planCents]
    );

    // // 1) Assign AB on first open
    // React.useEffect(() => {
    //     fetch('/api/cancel/assign', { method: 'POST' })
    //         .then(r => r.json())
    //         .then(({ variant }) => {
    //             console.log('variant', variant);
    //             dispatch(setAbVariant(variant))
    //         });
    // }, [dispatch]);

    // // 2) Mark subscription pending + get plan price
    // React.useEffect(() => {
    //     fetch('/api/cancel/start', { method: 'POST' })
    //         .then(r => r.json())
    //         .then((json) => {
    //             if (json?.price_cents) dispatch(setPlanCents(json.price_cents));
    //             // store subscription_id locally to send on complete
    //             if (json?.subscription_id) setSubId(json.subscription_id); // see local state below
    //         });
    // }, [dispatch]);

    // Ensure we only write one row even if user bounces around terminals
    // const completedRef = React.useRef(false);

    // async function completeOnce() {
    //     if (completedRef.current) return;
    //     if (!subId) return; // wait until /start returned

    //     completedRef.current = true;

    //     const payload = {
    //         subscription_id: subId,
    //         accepted_downsell: !!cancel.offerAccepted,
    //         downsell_variant: (cancel.abVariant ?? 'A') as 'A' | 'B',
    //         reason: buildReasonFromState(cancel),
    //     };

    //     try {
    //         await fetch('/api/cancel/complete', {
    //             method: 'POST',
    //             headers: { 'content-type': 'application/json' },
    //             body: JSON.stringify(payload),
    //         });
    //     } catch (e) {
    //         console.error('complete failed', e);
    //     }
    // }

    // // Whenever we ENTER a terminal step, write completion
    // React.useEffect(() => {
    //     const terminalSteps = new Set([
    //         'accepted.offer',              // accepted the offer
    //         'complete.subscriptionEnded',  // cancelled, no job
    //         'complete.withVisa',           // found job, with visa
    //         'complete.noVisa',             // found job, without visa
    //     ]);
    //     if (terminalSteps.has(cancel.step as any)) {
    //         completeOnce();
    //     }
    // }, [cancel.step, subId]); // note: depends on step & subId only




    const onBack = () => {
        // Simple back rules — you can refine with a graph if needed
        const map: Record<string, string> = {
            offer: "start.askFoundJob",
            "survey.noJob": "offer",
            "survey.foundJob": "start.askFoundJob",
            "feedback.wish": "survey.foundJob",
            reason: "survey.noJob",
            visa: "feedback.wish",
            "accepted.offer": "offer",
            "continued.subscription": "accepted.offer",
        };
        const prev = (map as any)[cancel.step];
        if (prev) dispatch(setStep(prev as any));
    };


    const titleByStep: Record<string, string> = {
        "start.askFoundJob": "Subscription Cancellation",
        offer: "Subscription Cancellation",
        "survey.noJob": "Subscription Cancellation",
        "survey.foundJob": "Subscription Cancellation",
        "feedback.wish": "Subscription Cancellation",
        reason: "Subscription Cancellation",
        visa: "Subscription Cancellation",
        "complete.withVisa": "Subscription Cancelled",
        "complete.noVisa": "Subscription Cancelled",
        "complete.subscriptionEnded": "Subscription Cancelled",
        "accepted.offer": "Subscription Continued",
        "continued.subscription": "Subscription Continued",
    };
    return (
        <Modal open={cancel.open} onClose={() => dispatch(closeModal())} size="lg" ariaLabel="Cancel subscription">
            <ModalHeader
                title={titleByStep[cancel.step]}
                onClose={() => dispatch(closeModal())}
                onBack={onBack}
                stepper={stepper.currentStep > 0 ? <Stepper totalSteps={stepper.totalSteps} currentStep={stepper.currentStep} /> : null}
            />
            <ModalBody>
                {/* Back button only on mobile */}
                <button
                    type="button"
                    onClick={onBack}
                    className="md:hidden inline-flex items-center gap-2 pl-2 justify-center align-center font-sans cursor-pointer"
                    aria-label="Back"
                >
                    <img src="/left.svg" alt="Back" className="w-4 h-4" />
                    <span className="text-[#62605C] font-sans text-[12px] font-semibold leading-none">
                        Back
                    </span>
                </button>

                {/* Step 1 - Ask Found Job */}
                {cancel.step === "start.askFoundJob" && (
                    <CancelCard
                        imageUrl="/empire-state-compressed.jpg"
                        onNo={() => dispatch(setFoundJob(false))}
                        onYes={() => dispatch(setFoundJob(true))}
                    />
                )}

                {/* Step 2 - NO JOB - Offer Card with Discount Price */}
                {cancel.step === "offer" && (
                    <CancelOfferCard
                        imageUrl="/empire-state-compressed.jpg"
                        headline={headline}
                        priceWas={priceWas}
                        priceNow={priceNow}
                        onAccept={() => dispatch(acceptOffer())}
                        onDecline={() => dispatch(setStep("survey.noJob"))}
                    />
                )}


                {/* Step 2 - YES JOB - Usage Survey*/}
                {cancel.step === "survey.foundJob" && (
                    <UsageSurveyCard
                        imageUrl="/empire-state-compressed.jpg"
                        variant="foundJob"
                        onAcceptOffer={() => dispatch(acceptOffer())}
                        onContinue={() => dispatch(setStep("feedback.wish"))}
                        initial={cancel.survey}
                        onChange={(p: any) => dispatch(setSurvey(p))}
                    />
                )}

                {/* Step 3 - NO JOB - Usage Survey*/}
                {cancel.step === "survey.noJob" && (
                    <UsageSurveyCard
                        imageUrl="/empire-state-compressed.jpg"
                        variant="noJob"
                        onAcceptOffer={() => dispatch(acceptOffer())}
                        onContinue={() => dispatch(setStep("reason"))}
                        // OPTIONAL: if you add `initial` + `onChange` to the card
                        initial={cancel.survey}
                        onChange={(p: any) => dispatch(setSurvey(p))}
                    />
                )}

                {/* Step 3 - YES JOB - Feedback Wish */}
                {cancel.step === "feedback.wish" && (
                    <FeedbackWishCard
                        imageUrl="/empire-state-compressed.jpg"
                        minChars={25}
                        onContinue={(txt: string) => { dispatch(setWishText(txt)); dispatch(setStep("visa")); }}
                        initialValue={cancel.wishText}
                    />
                )}

                {/* Step 4 - NO JOB - Cancel Reason */}
                {cancel.step === 'reason' && (
                    <CancelReasonCard
                        priceLabel={money(cancel.planCents ?? 2500)}
                        onAcceptOffer={() => dispatch(acceptOffer())}
                        initial={cancel.reason}
                        onChange={(p: any) => dispatch(setReason(p))}
                        onCompleteCancel={(payload: any) => {
                            dispatch(setReason(payload));
                            dispatch(setStep('complete.subscriptionEnded')); // entering terminal triggers completeOnce()
                        }}
                    />
                )}

                {/* {cancel.step === 'reason' && (
                    <CancelReasonCard
                        priceLabel={money(cancel.planCents ?? 2500)}
                        onAcceptOffer={() => dispatch(acceptOffer())}
                        initial={cancel.reason}
                        onChange={(p: any) => dispatch(setReason(p))}
                        onCompleteCancel={async (payload: { reason?: string; amount?: string; details?: string }) => {
                            // 1) pick a single reason string
                            const reasonText =
                                (payload.details && String(payload.details).trim()) ||
                                (payload.amount && String(payload.amount).trim()) ||
                                (payload.reason && String(payload.reason).trim()) ||
                                'No reason provided';

                            // 2) send to API
                            await fetch('/api/cancel/complete', {
                                method: 'POST',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({
                                    subscription_id: subId,
                                    accepted_downsell: !!cancel.offerAccepted,
                                    downsell_variant: cancel.abVariant ?? 'A',
                                    reason: reasonText,
                                }),
                            });

                            // 3) move to final screen
                            dispatch(setStep('complete.subscriptionEnded'));
                        }}
                    />
                )} */}

                {/* {cancel.step === "reason" && (
                    <CancelReasonCard
                        imageUrl="/empire-state-compressed.jpg"
                        priceLabel="$12.50"
                        onAcceptOffer={() => dispatch(acceptOffer())}
                        onCompleteCancel={(payload: any) => {
                            dispatch(setReason(payload));
                            dispatch(setStep("complete.subscriptionEnded"));
                        }}
                        initial={cancel.reason}
                        onChange={(p: any) => dispatch(setReason(p))}
                    />
                )} */}


                {/* Step 4 - YES JOB - Visa Support */}
                {cancel.step === "visa" && (
                    <VisaSupportCard
                        imageUrl="/empire-state-compressed.jpg"
                        variant={cancel.survey.foundWithMigrateMate === "yes" ? "withMM" : "notWithMM"}
                        onCompleteCancel={(payload: any) => {
                            dispatch(setVisa({ ...payload, variant: cancel.survey.foundWithMigrateMate === "yes" ? "withMM" : "notWithMM" }));
                            if (payload.hasLawyer == "yes") {
                                dispatch(setStep("complete.noVisa"));
                            } else {
                                dispatch(setStep("complete.withVisa"));
                            }
                        }}
                        initial={{ hasLawyer: cancel.visa?.hasLawyer, visa: cancel.visa?.visa }}
                        onChange={(p: any) => { dispatch(setVisa(p)) }}
                    />
                )}

                {/* End of Flow - Accepted Offer */}
                {cancel.step === "accepted.offer" && (
                    <CancelOfferAcceptedCard
                        imageUrl="/empire-state-compressed.jpg"
                        daysLeft={"XX"}
                        startDate={"Jan 20, 2026"}
                        monthlyPrice={"$12.50"}
                        onPrimary={() => dispatch(closeModal())}
                    />
                )}



                {/* End of Flow - NO JOB - Subscription Ended */}
                {cancel.step === "complete.subscriptionEnded" && (
                    <SubscriptionCancelledCard
                        imageUrl="/empire-state-compressed.jpg"
                        endDate={cancel.endDate ?? "Oct 12, 2025"}
                        onBackToJobs={() => dispatch(closeModal())}
                    />
                )}

                {/* End of Flow - YES JOB - Visa Support - Cancellation Complete */}
                {cancel.step === "complete.withVisa" && (
                    <CancellationCompleteCard
                        imageUrl="/empire-state-compressed.jpg"
                        variant="helpVisa"
                        onFinish={() => dispatch(closeModal())}
                        contact={{ avatarUrl: "/mihailo-profile.jpeg", name: "Mihailo", email: "mihailo@migrate-mate.com" }}
                    />
                )}

                {/* End of Flow - YES JOB - No Visa Support - Cancellation Complete */}
                {cancel.step === "complete.noVisa" && (
                    <CancellationCompleteCard
                        imageUrl="/empire-state-compressed.jpg"
                        variant="noHelpVisa"
                        onFinish={() => dispatch(closeModal())} />
                )}
            </ModalBody>
        </Modal>
    )
}
