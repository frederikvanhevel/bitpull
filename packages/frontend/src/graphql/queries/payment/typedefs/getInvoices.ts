/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getInvoices
// ====================================================

export interface getInvoices_getInvoices {
  __typename: "Invoice";
  amount: number;
  currency: string;
  date: any;
  status: string;
  url: string;
}

export interface getInvoices {
  getInvoices: getInvoices_getInvoices[];
}
