/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ResourceType } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getStorageEntries
// ====================================================

export interface getStorageEntries_getStorageEntries {
  __typename: "Storage";
  _id: string;
  resourceId: string | null;
  resourceName: string;
  resourceType: ResourceType;
  count: number;
}

export interface getStorageEntries {
  getStorageEntries: getStorageEntries_getStorageEntries[];
}

export interface getStorageEntriesVariables {
  resourceType: ResourceType;
}
