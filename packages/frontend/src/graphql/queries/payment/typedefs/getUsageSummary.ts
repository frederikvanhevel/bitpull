/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsageSummary
// ====================================================

export interface getUsageSummary_getUsageSummary {
  __typename: "UsageSummary";
  total: number;
  start: any;
  end: any | null;
}

export interface getUsageSummary_getPaymentDetails {
  __typename: "PaymentDetails";
  credits: number;
}

export interface getUsageSummary {
  getUsageSummary: getUsageSummary_getUsageSummary | null;
  getPaymentDetails: getUsageSummary_getPaymentDetails;
}
