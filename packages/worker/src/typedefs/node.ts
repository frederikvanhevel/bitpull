import { Page } from 'puppeteer'
import CustomBrowser from '../browser'
import { FlowError } from '../utils/errors'
import { HtmlNode, MultipleHtmlNode } from '../nodes/processing/html/typedefs'
import Traverser from '../traverse'
import { LogType, StorageObject, Integration, Settings } from './common'

export type NodeId = string

export enum NodeType {
    COLLECT = 'COLLECT',
    PAGINATION = 'PAGINATION',
    HTML = 'HTML',
    HTML_LINKED = 'HTML_LINKED',
    HTML_MULTIPLE = 'HTML_MULTIPLE',
    CLICK = 'CLICK',
    CLICK_MULTIPLE = 'CLICK_MULTIPLE',
    LOGIN = 'LOGIN',
    FUNCTION = 'FUNCTION',
    EXCEL = 'EXCEL',
    CSV = 'CSV',
    JSON = 'JSON',
    SCREENSHOT = 'SCREENSHOT',
    PDF = 'PDF',
    SLACK = 'SLACK',
    EMAIL = 'EMAIL',
    DROPBOX = 'DROPBOX',
    STORAGE = 'STORAGE',
    GOOGLE_DRIVE = 'GOOGLE_DRIVE',
    ONEDRIVE = 'ONEDRIVE',
    GITHUB = 'GITHUB',
    WEBHOOK = 'WEBHOOK',
    WAIT = 'WAIT',
    SCROLL = 'SCROLL'
}

export interface FlowNode {
    id: NodeId
    type: NodeType
    disabled?: boolean
    skipChildren?: boolean
    children?: FlowNode[]
}

export type RootNode =
    | HtmlNode
    | (MultipleHtmlNode & {
          parsedLink?: string
      })

export interface NodeInput<T, S = any, P = any> {
    node: T
    parent?: FlowNode
    parentResult?: P
    passedData?: S
    rootAncestor?: RootNode
    page?: Page
    branchCallback?: (data: object | object[]) => void
}

export interface TraverseOptions {
    onStart?: (node: FlowNode) => void
    onComplete?: (node: FlowNode) => void
    onError?: (node: FlowNode, error: FlowError) => void
    onLog?: (node: FlowNode, message: string, type?: LogType) => void
    onWatch?: (result: object | object[]) => void
    onStorage?: (data: StorageObject) => void
    watchedNodeId?: NodeId
    settings: Settings
    integrations?: Integration[]
}

interface ParseResult<T, S> extends NodeInput<FlowNode> {
    passedData?: T
    parentResult?: S
}

export type NodeParser<T, S = any, P = any> = (
    input: NodeInput<T>,
    options: TraverseOptions,
    context: Context
) => Promise<ParseResult<S, P>>

export interface UploadedFile {
    name: string
    url: string
    previewType?: string
}

export interface Context {
    traverser: Traverser
    browser: CustomBrowser
}

export interface BranchNode extends FlowNode {
    goToPerPage: NodeId
    goToOnEnd?: NodeId
}
