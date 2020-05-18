/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Plan } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getPaymentDetails
// ====================================================

export interface getPaymentDetails_getPaymentDetails {
  __typename: "PaymentDetails";
  plan: Plan;
  sourceLast4: string | null;
  sourceBrand: string | null;
  trialEndsAt: any | null;
  credits: number;
  earnedCredits: number;
}

export interface getPaymentDetails {
  getPaymentDetails: getPaymentDetails_getPaymentDetails;
}
