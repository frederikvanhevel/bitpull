/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrentUser
// ====================================================

export interface getCurrentUser_getCurrentUser_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface getCurrentUser_getCurrentUser {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: getCurrentUser_getCurrentUser_settings;
  referralId: string;
}

export interface getCurrentUser {
  getCurrentUser: getCurrentUser_getCurrentUser;
}
