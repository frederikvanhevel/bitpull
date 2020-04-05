/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserObject
// ====================================================

export interface UserObject_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface UserObject {
  __typename: "User";
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: UserObject_settings;
}
