/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IntegrationType } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getActiveIntegrations
// ====================================================

export interface getActiveIntegrations_getActiveIntegrations {
  __typename: "Integration";
  _id: string;
  type: IntegrationType;
  active: boolean;
  hasSettings: boolean;
}

export interface getActiveIntegrations {
  getActiveIntegrations: getActiveIntegrations_getActiveIntegrations[];
}
