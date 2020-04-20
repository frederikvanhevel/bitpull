import { Page } from 'puppeteer';
import CustomBrowser from '../browser';
import { FlowError } from '../utils/errors';
import { HtmlNode } from '../nodes/processing/html/typedefs';
import Traverser from '../traverse';
import { LogType, StorageObject, Integration, Settings } from './common';
export declare type NodeId = string;
export declare enum NodeType {
    COLLECT = "COLLECT",
    PAGINATION = "PAGINATION",
    HTML = "HTML",
    CLICK = "CLICK",
    LOGIN = "LOGIN",
    FUNCTION = "FUNCTION",
    EXCEL = "EXCEL",
    CSV = "CSV",
    JSON = "JSON",
    SCREENSHOT = "SCREENSHOT",
    PDF = "PDF",
    SLACK = "SLACK",
    EMAIL = "EMAIL",
    DROPBOX = "DROPBOX",
    STORAGE = "STORAGE",
    GOOGLE_DRIVE = "GOOGLE_DRIVE",
    ONEDRIVE = "ONEDRIVE",
    GITHUB = "GITHUB",
    WEBHOOK = "WEBHOOK",
    WAIT = "WAIT"
}
export interface FlowNode {
    id: NodeId;
    type: NodeType;
    disabled?: boolean;
    children?: FlowNode[];
}
export declare type RootNode = HtmlNode;
export interface NodeInput<T, S = any, P = any> {
    node: T;
    parent?: FlowNode;
    parentResult?: P;
    passedData?: S;
    rootAncestor?: RootNode;
    page?: Page;
    paginationCallback?: (data: any) => void;
}
export interface TraverseOptions {
    onStart?: (node: FlowNode) => void;
    onComplete?: (node: FlowNode) => void;
    onError?: (node: FlowNode, error: FlowError) => void;
    onLog?: (node: FlowNode, message: string, type?: LogType) => void;
    onWatch?: (result: object | object[]) => void;
    onStorage?: (data: StorageObject) => void;
    watchedNodeId?: NodeId;
    settings: Settings;
    integrations?: Integration[];
}
interface ParseResult<T, S> extends NodeInput<FlowNode> {
    passedData?: T;
    parentResult?: S;
}
export declare type NodeParser<T, S = any, P = any> = (input: NodeInput<T>, options: TraverseOptions, context: Context) => Promise<ParseResult<S, P>>;
export interface UploadedFile {
    name: string;
    url: string;
    previewType?: string;
}
export interface Context {
    traverser: Traverser;
    browser: CustomBrowser;
}
export {};
