/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OAuthInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: oAuth
// ====================================================

export interface oAuth_oAuth_user_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface oAuth_oAuth_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: oAuth_oAuth_user_settings;
  referralId: string;
}

export interface oAuth_oAuth {
  __typename: "LoginUserResponse";
  token: string;
  user: oAuth_oAuth_user;
}

export interface oAuth {
  oAuth: oAuth_oAuth;
}

export interface oAuthVariables {
  data: OAuthInput;
}
