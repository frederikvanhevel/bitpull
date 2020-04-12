/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginUserInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login_user_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface login_login_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: login_login_user_settings;
  referralId: string;
}

export interface login_login {
  __typename: "LoginUserResponse";
  token: string;
  user: login_login_user;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  data: LoginUserInput;
}
