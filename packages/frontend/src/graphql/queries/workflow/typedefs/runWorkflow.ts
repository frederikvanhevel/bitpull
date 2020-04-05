/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Status, LogType } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: runWorkflow
// ====================================================

export interface runWorkflow_runWorkflow_errors {
  __typename: "ErrorEntry";
  date: any;
  nodeId: string;
  nodeType: string;
  message: string;
  code: string | null;
}

export interface runWorkflow_runWorkflow_logs {
  __typename: "LogEntry";
  type: LogType;
  date: any;
  nodeId: string;
  nodeType: string;
  message: string;
}

export interface runWorkflow_runWorkflow {
  __typename: "WorkflowResult";
  status: Status;
  errors: runWorkflow_runWorkflow_errors[];
  logs: runWorkflow_runWorkflow_logs[];
}

export interface runWorkflow {
  runWorkflow: runWorkflow_runWorkflow;
}

export interface runWorkflowVariables {
  node: any;
  name: string;
  watchedNodeId?: string | null;
}
