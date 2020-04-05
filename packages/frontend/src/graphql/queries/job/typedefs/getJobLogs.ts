/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LogType } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getJobLogs
// ====================================================

export interface getJobLogs_getJobLogs_logs {
  __typename: "LogEntry";
  date: any;
  type: LogType;
  nodeId: string;
  nodeType: string;
  message: string;
}

export interface getJobLogs_getJobLogs {
  __typename: "Log";
  logs: (getJobLogs_getJobLogs_logs | null)[];
}

export interface getJobLogs {
  getJobLogs: getJobLogs_getJobLogs | null;
}

export interface getJobLogsVariables {
  id: string;
}
