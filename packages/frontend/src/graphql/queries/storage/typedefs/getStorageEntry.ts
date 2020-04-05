/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StorageService } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL query operation: getStorageEntry
// ====================================================

export interface getStorageEntry_getStorageEntry {
  __typename: "StorageLink";
  _id: string;
  service: StorageService;
  fileName: string;
  url: string;
  contentType: string;
  expiryDate: any | null;
  createdAt: any;
}

export interface getStorageEntry {
  getStorageEntry: getStorageEntry_getStorageEntry[];
}

export interface getStorageEntryVariables {
  id: string;
  offset?: number | null;
  limit?: number | null;
}
