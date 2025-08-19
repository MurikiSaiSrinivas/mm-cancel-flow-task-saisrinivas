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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
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
    setAbVariant,
    setPlanCents,
} from "../../store/cancelFlowSlice";


export default function CancelModal() {

    const dispatch = useAppDispatch();
    const cancel = useAppSelector(selectCancel);
    const stepper = useAppSelector(selectStepper);


    // 1) Assign AB on first open
    React.useEffect(() => {
        fetch('/api/cancel/assign', { method: 'POST' })
            .then(r => r.json())
            .then(({ variant }) => dispatch(setAbVariant(variant)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2) Mark subscription pending + get plan price
    React.useEffect(() => {
        fetch('/api/cancel/start', { method: 'POST' })
            .then(r => r.json())
            .then((json) => {
                if (json?.price_cents) dispatch(setPlanCents(json.price_cents));
                // store subscription_id locally to send on complete
                setSubId(json.subscription_id); // see local state below
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



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
    console.log(stepper);
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
                {cancel.step === "reason" && (
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
                )}

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
