/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { JobInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: createJob
// ====================================================

export interface createJob_createJob {
  __typename: "Job";
  id: string;
}

export interface createJob {
  createJob: createJob_createJob;
}

export interface createJobVariables {
  input: JobInput;
}
