/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getWorkflow
// ====================================================

export interface getWorkflow_getWorkflow_settings {
  __typename: "WorkflowSettings";
  useProxy: boolean;
}

export interface getWorkflow_getWorkflow {
  __typename: "Workflow";
  id: string;
  name: string;
  node: any;
  settings: getWorkflow_getWorkflow_settings;
}

export interface getWorkflow {
  getWorkflow: getWorkflow_getWorkflow;
}

export interface getWorkflowVariables {
  id: string;
}
