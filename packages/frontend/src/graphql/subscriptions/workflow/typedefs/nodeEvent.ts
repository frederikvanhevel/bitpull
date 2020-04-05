/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NodeEvent } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL subscription operation: nodeEvent
// ====================================================

export interface nodeEvent_nodeEvent {
  __typename: "WorkflowEvent";
  event: NodeEvent;
  data: any | null;
}

export interface nodeEvent {
  nodeEvent: nodeEvent_nodeEvent | null;
}
