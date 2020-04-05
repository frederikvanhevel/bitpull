/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WorkflowInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: updateWorkflow
// ====================================================

export interface updateWorkflow_updateWorkflow {
  __typename: "Workflow";
  id: string;
  name: string;
}

export interface updateWorkflow {
  updateWorkflow: updateWorkflow_updateWorkflow;
}

export interface updateWorkflowVariables {
  id: string;
  data: WorkflowInput;
}
