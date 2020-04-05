import { NodeInput, FlowNode } from '../../typedefs/node';
import { Settings } from '../../typedefs/common';
import { CollectNode } from './collect/typedefs';
import { HtmlParseResult } from './html/typedefs';
export interface HTMLSelector {
    value: string;
    attribute?: string;
}
export declare const getFieldFromHtml: (html: string, selector: HTMLSelector, url?: string | undefined, xmlMode?: boolean) => string | undefined;
export declare const getFieldsFromHtml: (input: NodeInput<CollectNode, any, HtmlParseResult>, settings: Settings, xmlMode?: boolean) => Record<string, string | number> | Record<string, string | number>[];
export declare const getFieldFromXml: (html: string, field: HTMLSelector, url?: string | undefined) => string | undefined;
export declare const getFieldsFromXml: (input: NodeInput<CollectNode, any, any>, settings: Settings) => Record<string, string | number> | Record<string, string | number>[];
export declare const getSelectorParser: (node: FlowNode) => ((html: string, selector: HTMLSelector, url?: string | undefined, xmlMode?: boolean) => string | undefined) | null;
