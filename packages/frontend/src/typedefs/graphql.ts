/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AnalyticsPeriod {
  LAST_MONTH = "LAST_MONTH",
  LAST_WEEK = "LAST_WEEK",
}

export enum IntegrationType {
  DROPBOX = "DROPBOX",
  GITHUB = "GITHUB",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  ONEDRIVE = "ONEDRIVE",
  SLACK = "SLACK",
}

export enum LogType {
  ERROR = "ERROR",
  INFO = "INFO",
  WARN = "WARN",
}

export enum NodeEvent {
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
  START = "START",
  STORAGE = "STORAGE",
  WATCH = "WATCH",
}

export enum OAuthProvider {
  GOOGLE = "GOOGLE",
}

export enum Plan {
  METERED = "METERED",
  MONTHLY = "MONTHLY",
}

export enum ResourceType {
  JOB = "JOB",
  TEST_RUN = "TEST_RUN",
}

export enum ScheduleType {
  CRON = "CRON",
  INTERVAL = "INTERVAL",
  ONCE = "ONCE",
}

export enum Status {
  ERROR = "ERROR",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
  SUCCESS = "SUCCESS",
}

export enum StorageService {
  DROPBOX = "DROPBOX",
  GITHUB = "GITHUB",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  NATIVE = "NATIVE",
  ONEDRIVE = "ONEDRIVE",
}

export interface Card {
  object: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
}

export interface JobInput {
  name: string;
  workflowId: string;
  type: ScheduleType;
  schedule: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface OAuthInput {
  provider: OAuthProvider;
  code: string;
  referralId?: string | null;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralId?: string | null;
}

export interface Token {
  id: string;
  object: string;
  card: Card;
  created: number;
  livemode: boolean;
  type: string;
  used: boolean;
}

export interface TokenInput {
  token: Token;
}

export interface UpdateUserInput {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface UserSettingsInput {
  failedJobEmail: boolean;
}

export interface WorkflowInput {
  name: string;
  node: any;
  settings: WorkflowSettingsInput;
}

export interface WorkflowSettingsInput {
  useProxy: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
