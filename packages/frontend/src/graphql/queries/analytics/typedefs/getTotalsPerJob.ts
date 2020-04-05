/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnalyticsPeriod } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getTotalsPerJob
// ====================================================

export interface getTotalsPerJob_getTotalsPerJob_job {
  __typename: "Job";
  id: string;
  name: string;
}

export interface getTotalsPerJob_getTotalsPerJob {
  __typename: "TotalsPerJob";
  job: getTotalsPerJob_getTotalsPerJob_job;
  completed: number;
  failed: number;
  total: number;
}

export interface getTotalsPerJob {
  getTotalsPerJob: getTotalsPerJob_getTotalsPerJob[];
}

export interface getTotalsPerJobVariables {
  period: AnalyticsPeriod;
}
