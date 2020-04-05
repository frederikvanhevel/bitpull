/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateUserInput } from "./../../../../typedefs/graphql";

// ====================================================
// GraphQL mutation operation: updateInformation
// ====================================================

export interface updateInformation_updateInformation_settings {
  __typename: "UserSettings";
  failedJobEmail: boolean;
}

export interface updateInformation_updateInformation {
  __typename: "User";
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  verified: boolean;
  settings: updateInformation_updateInformation_settings;
}

export interface updateInformation {
  updateInformation: updateInformation_updateInformation;
}

export interface updateInformationVariables {
  data: UpdateUserInput;
}
