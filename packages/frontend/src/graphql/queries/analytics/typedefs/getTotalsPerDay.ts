/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnalyticsPeriod } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getTotalsPerDay
// ====================================================

export interface getTotalsPerDay_getTotalsPerDay {
  __typename: "TotalsPerDay";
  date: any;
  completed: number;
  failed: number;
  total: number;
}

export interface getTotalsPerDay {
  getTotalsPerDay: getTotalsPerDay_getTotalsPerDay[];
}

export interface getTotalsPerDayVariables {
  period: AnalyticsPeriod;
}
