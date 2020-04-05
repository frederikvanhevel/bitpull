/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WorkflowInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: createWorkflow
// ====================================================

export interface createWorkflow_createWorkflow {
  __typename: "Workflow";
  id: string;
  name: string;
  updatedAt: any;
}

export interface createWorkflow {
  createWorkflow: createWorkflow_createWorkflow;
}

export interface createWorkflowVariables {
  data: WorkflowInput;
}
