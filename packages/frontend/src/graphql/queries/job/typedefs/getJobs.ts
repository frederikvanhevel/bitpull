/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getJobs
// ====================================================

export interface getJobs_getJobs_status {
  __typename: "JobStatus";
  running: boolean;
  scheduled: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
  repeating: boolean;
  paused: boolean;
}

export interface getJobs_getJobs {
  __typename: "ScheduledJob";
  id: string;
  name: string;
  workflowId: string;
  workflowName: string;
  hasErrors: boolean | null;
  nextRun: any | null;
  lastRun: any | null;
  lastFinished: any | null;
  repeatInterval: string | null;
  status: getJobs_getJobs_status;
}

export interface getJobs {
  getJobs: getJobs_getJobs[];
}
