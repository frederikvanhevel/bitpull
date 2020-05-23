import { NodeId, NodeType } from './node'

export enum LogType {
    INFO = 'INFO',
    ERROR = 'ERROR',
    WARN = 'WARN'
}

export enum StorageService {
    NATIVE = 'NATIVE',
    DROPBOX = 'DROPBOX',
    GOOGLE_DRIVE = 'GOOGLE_DRIVE',
    ONEDRIVE = 'ONEDRIVE',
    GITHUB = 'GITHUB'
}

export interface AmazonS3Credentials {
    bucket: string
    accessKeyId: string
    secretAccessKey: string
}

export interface StorageObject {
    service: StorageService
    fileName: string
    url: string
    contentType: string
}

export enum IntegrationType {
    SLACK = 'SLACK',
    DROPBOX = 'DROPBOX',
    GOOGLE_DRIVE = 'GOOGLE_DRIVE',
    ONEDRIVE = 'ONEDRIVE',
    GITHUB = 'GITHUB'
}

export interface IntegrationSettings {
    access_token?: string
    refresh_token?: string
}

export interface Integration {
    type: IntegrationType
    active: boolean
    settings: IntegrationSettings
}

export enum StorageProvider {
    NONE = 'NONE',
    AMAZON = 'AMAZON'
}

export interface EncryptionSettings {
    version: string
    key: string
}

export interface StorageSettings {
    provider: StorageProvider
    credentials?: AmazonS3Credentials
    changesOnly?: boolean
}

export interface Settings {
    puppeteer?: {
        endpoint: string
        proxy?: string
        authorization?: string
    }
    proxyEndpoint?: string
    storage?: StorageSettings
    email?: {
        apiKey: string
        template: string
        to: string
    }
    exitOnError?: boolean
    useSinglePage?: boolean
    traceId?: string
    encryption?: EncryptionSettings
    debug?: boolean
    metaData?: {
        id: string
        isJob: boolean
        name: string
    }
}

export enum Status {
    UNDETERMINED = 'UNDETERMINED',
    SUCCESS = 'SUCCESS',
    PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
    ERROR = 'ERROR'
}

export interface ErrorLog {
    nodeId: NodeId
    nodeType: NodeType
    date: Date
    message: string
    code: string
}

export interface ParseLog {
    type?: LogType
    date: Date
    nodeId: NodeId
    nodeType: NodeType
    message: string
}

export interface FileStorageObject extends StorageObject {
    createdAt: Date
}

export interface ParseResult {
    status: Status
    logs: ParseLog[]
    errors: ErrorLog[]
    files: FileStorageObject[]
    stats: Stats
}

export interface ErrorMessage {
    code: string
    message: string
}

export interface Stats {
    pages: string[]
    pageCount: number
    duration: number
}
