/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type DownsellVariant = 'A' | 'B';


export type CancelStep =
    | "start.askFoundJob"
    | "offer"
    | "survey.noJob"
    | "survey.foundJob"
    | "feedback.wish"
    | "reason"
    | "visa"
    | "complete.withVisa"
    | "complete.noVisa"
    | "complete.subscriptionEnded"
    | "accepted.offer";


export type SurveyState = {
    applied?: string; // 0 | 1-5 | 6-20 | 20+
    emailed?: string; // 0 | 1-5 | 6-20 | 20+
    interviewed?: string; // 0 | 1-2 | 3-5 | 5+
    foundWithMigrateMate?: "yes" | "no"; // when foundJob path
};


export type ReasonState = {
    reason?: "too_expensive" | "not_helpful" | "not_relevant" | "not_moving" | "other";
    amount?: string;
    details?: string;
};


export type VisaState = {
    hasLawyer?: "yes" | "no";
    visa?: string;
    variant?: "withMM" | "notWithMM";
};


export interface CancelFlowState {
    open: boolean;
    step: CancelStep;
    foundJob?: boolean;
    offerAccepted?: boolean;
    survey: SurveyState;
    wishText?: string;
    reason: ReasonState;
    visa: VisaState;
    endDate?: string; // e.g. "Oct 12, 2025"
    abVariant?: DownsellVariant;   // 'A' or 'B'
    planCents?: number; // 2500, 2900, 3900
}


const initialState: CancelFlowState = {
    open: false,
    step: "start.askFoundJob",
    survey: {},
    reason: {},
    visa: {},
    abVariant: undefined,
    planCents: undefined,
};


const slice = createSlice({
    name: "cancelFlow",
    initialState,
    reducers: {
        openModal(state) { state.open = true; },
        closeModal() { return { ...initialState, open: false }; },
        reset(state) { return { ...initialState, open: state.open }; },


        setStep(state, action: PayloadAction<CancelStep>) { state.step = action.payload; },


        setFoundJob(state, action: PayloadAction<boolean>) {
            state.foundJob = action.payload;
            state.step = action.payload ? "survey.foundJob" : "offer";
        },


        acceptOffer(state) { state.offerAccepted = true; state.step = "accepted.offer"; },


        setSurvey(state, action: PayloadAction<Partial<SurveyState>>) {
            state.survey = { ...state.survey, ...action.payload };
        },


        setWishText(state, action: PayloadAction<string>) {
            state.wishText = action.payload;
        },


        setReason(state, action: PayloadAction<Partial<ReasonState>>) {
            state.reason = { ...state.reason, ...action.payload };
        },


        setVisa(state, action: PayloadAction<Partial<VisaState>>) {
            state.visa = { ...state.visa, ...action.payload };
        },


        setEndDate(state, action: PayloadAction<string | undefined>) { state.endDate = action.payload; },

        setAbVariant(state, action: PayloadAction<DownsellVariant>) {
            state.abVariant = action.payload;
        },
        setPlanCents(state, action: PayloadAction<number | undefined>) {
            state.planCents = action.payload;
        },
    },
});


export const {
    openModal,
    closeModal,
    reset,
    setStep,
    setFoundJob,
    acceptOffer,
    setSurvey,
    setWishText,
    setReason,
    setVisa,
    setEndDate,
    setAbVariant,
    setPlanCents,
} = slice.actions;
export default slice.reducer;

// Selector helpers
export const selectCancel = (s: any) => (s as { cancelFlow: CancelFlowState }).cancelFlow;


export const selectStepper = (s: any) => {
    const { step, foundJob } = selectCancel(s);
    // Base total is 3 steps in Figma; offer path uses the same visual stepper (shows 1..3)
    const total = 3;
    const order: Record<CancelStep, number> = {
        "start.askFoundJob": 0,
        "offer": 1,
        "survey.foundJob": 1,
        "survey.noJob": 2,
        "feedback.wish": 2,
        "reason": 3,
        "visa": 3,
        "complete.withVisa": 4,
        "complete.noVisa": 4,
        "complete.subscriptionEnded": 4,
        "accepted.offer": 0
    };
    const current = order[step] ?? 0;
    return { totalSteps: total, currentStep: current, foundJob };
};