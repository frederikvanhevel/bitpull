/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RegisterUserInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: register
// ====================================================

export interface register_register_user_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface register_register_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: register_register_user_settings;
}

export interface register_register {
  __typename: "LoginUserResponse";
  token: string;
  user: register_register_user;
}

export interface register {
  register: register_register;
}

export interface registerVariables {
  data: RegisterUserInput;
}
