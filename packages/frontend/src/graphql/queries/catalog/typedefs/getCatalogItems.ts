/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCatalogItems
// ====================================================

export interface getCatalogItems_getCatalogItems {
  __typename: "CatalogItem";
  id: string;
  name: string;
  title: string;
  description: string | null;
  node: any;
}

export interface getCatalogItems {
  getCatalogItems: getCatalogItems_getCatalogItems[];
}
