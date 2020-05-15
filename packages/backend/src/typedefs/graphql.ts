export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Query = {
   __typename?: 'Query';
  getCurrentUser: User;
  getWorkflow: Workflow;
  getWorkflows: Array<Workflow>;
  runWorkflow: WorkflowResult;
  fetchSiteContent: Scalars['String'];
  getTotalsPerDay: Array<TotalsPerDay>;
  getTotalsPerJob: Array<TotalsPerJob>;
  getActiveIntegrations: Array<Integration>;
  getSlackChannels: Array<SlackChannel>;
  getGithubRepositories: Array<GithubRepository>;
  getJobs: Array<ScheduledJob>;
  getJobLogs?: Maybe<Log>;
  getStorageEntry: Array<StorageLink>;
  getStorageEntries: Array<Storage>;
  dummy?: Maybe<Scalars['String']>;
  hasPaymentMethod: Scalars['Boolean'];
  getPaymentDetails: PaymentDetails;
  getInvoices: Array<Invoice>;
  getUsageSummary?: Maybe<UsageSummary>;
  getCatalogItems: Array<CatalogItem>;
};


export type QueryGetWorkflowArgs = {
  id: Scalars['String'];
};


export type QueryRunWorkflowArgs = {
  node?: Maybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  watchedNodeId?: Maybe<Scalars['String']>;
};


export type QueryFetchSiteContentArgs = {
  node: Scalars['JSONObject'];
};


export type QueryGetTotalsPerDayArgs = {
  period: AnalyticsPeriod;
};


export type QueryGetTotalsPerJobArgs = {
  period: AnalyticsPeriod;
};


export type QueryGetJobLogsArgs = {
  id: Scalars['String'];
};


export type QueryGetStorageEntryArgs = {
  id: Scalars['String'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryGetStorageEntriesArgs = {
  resourceType: ResourceType;
};

export type Mutation = {
   __typename?: 'Mutation';
  login: LoginUserResponse;
  oAuth: LoginUserResponse;
  register: LoginUserResponse;
  forgotPassword: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  sendVerificationEmail: Scalars['Boolean'];
  verifyEmail: Scalars['Boolean'];
  updateInformation: User;
  cancelAccount: Scalars['Boolean'];
  updateSettings: Scalars['Boolean'];
  createWorkflow: Workflow;
  updateWorkflow: Workflow;
  removeWorkflow: Scalars['Boolean'];
  updateIntegration: Integration;
  removeIntegration: Scalars['Boolean'];
  toggleIntegration: Scalars['Boolean'];
  authorize: Scalars['Boolean'];
  createJob: Job;
  removeJob: Scalars['Boolean'];
  pauseJob: Scalars['Boolean'];
  resumeJob: Scalars['Boolean'];
  encrypt: Scalars['String'];
  feedback: Scalars['Boolean'];
  updatePayment: Scalars['Boolean'];
  changePlan: Scalars['Boolean'];
  cancelPlan: Scalars['Boolean'];
  addCatalogItem: CatalogItem;
  pickCatalogItem: Workflow;
};


export type MutationLoginArgs = {
  data: LoginUserInput;
};


export type MutationOAuthArgs = {
  data: OAuthInput;
};


export type MutationRegisterArgs = {
  data: RegisterUserInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};


export type MutationUpdateInformationArgs = {
  data: UpdateUserInput;
};


export type MutationUpdateSettingsArgs = {
  settings: UserSettingsInput;
};


export type MutationCreateWorkflowArgs = {
  data: WorkflowInput;
};


export type MutationUpdateWorkflowArgs = {
  id: Scalars['String'];
  data: WorkflowInput;
};


export type MutationRemoveWorkflowArgs = {
  id: Scalars['String'];
};


export type MutationUpdateIntegrationArgs = {
  id: Scalars['String'];
  data: IntegrationInput;
};


export type MutationRemoveIntegrationArgs = {
  id: Scalars['String'];
};


export type MutationToggleIntegrationArgs = {
  id: Scalars['String'];
  enabled: Scalars['Boolean'];
};


export type MutationAuthorizeArgs = {
  type: IntegrationType;
  data: Scalars['JSONObject'];
};


export type MutationCreateJobArgs = {
  input: JobInput;
};


export type MutationRemoveJobArgs = {
  id: Scalars['String'];
};


export type MutationPauseJobArgs = {
  id: Scalars['String'];
};


export type MutationResumeJobArgs = {
  id: Scalars['String'];
};


export type MutationEncryptArgs = {
  text: Scalars['String'];
};


export type MutationFeedbackArgs = {
  type: Scalars['String'];
  question: Scalars['String'];
};


export type MutationUpdatePaymentArgs = {
  input: TokenInput;
};


export type MutationChangePlanArgs = {
  plan: Plan;
};


export type MutationAddCatalogItemArgs = {
  data: CatalogItemInput;
};


export type MutationPickCatalogItemArgs = {
  id: Scalars['String'];
};

export type UserSettings = {
   __typename?: 'UserSettings';
  failedJobEmail: Scalars['Boolean'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
  settings: UserSettings;
  referralId: Scalars['String'];
};

export type UserSettingsInput = {
  failedJobEmail: Scalars['Boolean'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  referralId?: Maybe<Scalars['String']>;
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginUserResponse = {
   __typename?: 'LoginUserResponse';
  user: User;
  token: Scalars['String'];
};

export type UpdateUserInput = {
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export enum OAuthProvider {
  Google = 'GOOGLE'
}

export type OAuthInput = {
  provider: OAuthProvider;
  code: Scalars['String'];
  referralId?: Maybe<Scalars['String']>;
};

export type Subscription = {
   __typename?: 'Subscription';
  nodeEvent?: Maybe<WorkflowEvent>;
};

export type WorkflowSettings = {
   __typename?: 'WorkflowSettings';
  useProxy: Scalars['Boolean'];
};

export type Workflow = {
   __typename?: 'Workflow';
  id: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  node: Scalars['JSONObject'];
  settings: WorkflowSettings;
  updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
};

export type WorkflowSettingsInput = {
  useProxy: Scalars['Boolean'];
};

export type WorkflowInput = {
  name: Scalars['String'];
  node: Scalars['JSONObject'];
  settings: WorkflowSettingsInput;
};

export enum NodeEvent {
  Start = 'START',
  Complete = 'COMPLETE',
  Error = 'ERROR',
  Watch = 'WATCH',
  Storage = 'STORAGE'
}

export type WorkflowEvent = {
   __typename?: 'WorkflowEvent';
  event: NodeEvent;
  data?: Maybe<Scalars['JSONObject']>;
};

export enum LogType {
  Error = 'ERROR',
  Warn = 'WARN',
  Info = 'INFO'
}

export enum Status {
  Success = 'SUCCESS',
  PartialSuccess = 'PARTIAL_SUCCESS',
  Error = 'ERROR'
}

export type File = {
   __typename?: 'File';
  service: Scalars['String'];
  fileName: Scalars['String'];
  url: Scalars['String'];
  contentType: Scalars['String'];
  createdAt: Scalars['DateTime'];
};

export type LogEntry = {
   __typename?: 'LogEntry';
  date: Scalars['DateTime'];
  type: LogType;
  nodeId: Scalars['String'];
  nodeType: Scalars['String'];
  message: Scalars['String'];
};

export type ErrorEntry = {
   __typename?: 'ErrorEntry';
  nodeId: Scalars['String'];
  nodeType: Scalars['String'];
  date: Scalars['DateTime'];
  message: Scalars['String'];
  code?: Maybe<Scalars['String']>;
};

export type WorkflowResult = {
   __typename?: 'WorkflowResult';
  status: Status;
  errors: Array<ErrorEntry>;
  files: Array<Maybe<File>>;
  logs: Array<LogEntry>;
};



export enum AnalyticsPeriod {
  LastWeek = 'LAST_WEEK',
  LastMonth = 'LAST_MONTH'
}

export type TotalsPerDay = {
   __typename?: 'TotalsPerDay';
  date: Scalars['DateTime'];
  completed: Scalars['Int'];
  failed: Scalars['Int'];
  total: Scalars['Int'];
};

export type TotalsPerJob = {
   __typename?: 'TotalsPerJob';
  job: Job;
  completed: Scalars['Int'];
  failed: Scalars['Int'];
  total: Scalars['Int'];
};

export type AgendaJob = {
   __typename?: 'AgendaJob';
  lastRunAt?: Maybe<Scalars['DateTime']>;
  nextRunAt?: Maybe<Scalars['DateTime']>;
  lastFinishedAt?: Maybe<Scalars['DateTime']>;
  disabled?: Maybe<Scalars['Boolean']>;
};

export type Job = {
   __typename?: 'Job';
  id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  workflow: Workflow;
  agendaJob: AgendaJob;
  owner: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
};

export type JobStatus = {
   __typename?: 'JobStatus';
  running: Scalars['Boolean'];
  scheduled: Scalars['Boolean'];
  queued: Scalars['Boolean'];
  completed: Scalars['Boolean'];
  failed: Scalars['Boolean'];
  repeating: Scalars['Boolean'];
  paused: Scalars['Boolean'];
};

export type ScheduledJob = {
   __typename?: 'ScheduledJob';
  id: Scalars['String'];
  name: Scalars['String'];
  workflowId: Scalars['String'];
  workflowName: Scalars['String'];
  hasErrors?: Maybe<Scalars['Boolean']>;
  status: JobStatus;
  nextRun?: Maybe<Scalars['DateTime']>;
  lastRun?: Maybe<Scalars['DateTime']>;
  lastFinished?: Maybe<Scalars['DateTime']>;
  repeatInterval?: Maybe<Scalars['String']>;
};

export enum IntegrationType {
  Dropbox = 'DROPBOX',
  Slack = 'SLACK',
  Onedrive = 'ONEDRIVE',
  GoogleDrive = 'GOOGLE_DRIVE',
  Github = 'GITHUB'
}

export type Integration = {
   __typename?: 'Integration';
  _id: Scalars['String'];
  type: IntegrationType;
  active: Scalars['Boolean'];
  hasSettings: Scalars['Boolean'];
  owner?: Maybe<Scalars['String']>;
};

export type IntegrationSettings = {
   __typename?: 'IntegrationSettings';
  access_token?: Maybe<Scalars['String']>;
};

export type IntegrationInput = {
  active?: Maybe<Scalars['Boolean']>;
  settings?: Maybe<IntegrationSettingsInput>;
};

export type IntegrationSettingsInput = {
  access_token: Scalars['String'];
};

export type SlackChannel = {
   __typename?: 'SlackChannel';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GithubRepository = {
   __typename?: 'GithubRepository';
  name: Scalars['String'];
  owner: Scalars['String'];
};

export enum ScheduleType {
  Immediately = 'IMMEDIATELY',
  Once = 'ONCE',
  Interval = 'INTERVAL',
  Cron = 'CRON'
}

export type JobInput = {
  name: Scalars['String'];
  workflowId: Scalars['String'];
  type: ScheduleType;
  schedule?: Maybe<Scalars['String']>;
};

export type Log = {
   __typename?: 'Log';
  status: Scalars['String'];
  logs: Array<Maybe<LogEntry>>;
  workflow: Scalars['String'];
  job: Scalars['String'];
  date: Scalars['DateTime'];
};

export enum StorageService {
  Native = 'NATIVE',
  Dropbox = 'DROPBOX',
  GoogleDrive = 'GOOGLE_DRIVE',
  Onedrive = 'ONEDRIVE',
  Github = 'GITHUB'
}

export enum ResourceType {
  Job = 'JOB',
  TestRun = 'TEST_RUN'
}

export type StorageLink = {
   __typename?: 'StorageLink';
  _id: Scalars['String'];
  service: StorageService;
  fileName: Scalars['String'];
  contentType: Scalars['String'];
  expiryDate?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
};

export type Storage = {
   __typename?: 'Storage';
  _id: Scalars['String'];
  links: Array<StorageLink>;
  count: Scalars['Int'];
  resourceType: ResourceType;
  resourceId?: Maybe<Scalars['String']>;
  resourceName: Scalars['String'];
  owner: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Card = {
  object: Scalars['String'];
  brand: Scalars['String'];
  exp_month: Scalars['Int'];
  exp_year: Scalars['Int'];
  last4: Scalars['String'];
};

export type Token = {
  id: Scalars['String'];
  object: Scalars['String'];
  card: Card;
  created: Scalars['Int'];
  livemode: Scalars['Boolean'];
  type: Scalars['String'];
  used: Scalars['Boolean'];
};

export type TokenInput = {
  token: Token;
};

export enum Plan {
  Free = 'FREE',
  Metered = 'METERED',
  Small = 'SMALL',
  Business = 'BUSINESS',
  Premium = 'PREMIUM'
}

export type PaymentDetails = {
   __typename?: 'PaymentDetails';
  plan: Plan;
  sourceLast4?: Maybe<Scalars['String']>;
  sourceBrand?: Maybe<Scalars['String']>;
  trialEndsAt?: Maybe<Scalars['DateTime']>;
  disabled: Scalars['Boolean'];
  credits: Scalars['Int'];
  earnedCredits: Scalars['Int'];
};

export type Invoice = {
   __typename?: 'Invoice';
  amount: Scalars['Float'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  status: Scalars['String'];
  url: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type UsageSummary = {
   __typename?: 'UsageSummary';
  total: Scalars['Int'];
  start: Scalars['DateTime'];
  end?: Maybe<Scalars['DateTime']>;
};

export type CatalogItem = {
   __typename?: 'CatalogItem';
  id: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  node: Scalars['JSONObject'];
};

export type CatalogItemInput = {
  name: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  node: Scalars['JSONObject'];
  order: Scalars['Int'];
};
