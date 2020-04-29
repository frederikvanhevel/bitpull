import { Page } from 'puppeteer';
import { FlowNode, NodeType, BranchNode } from '../../../typedefs/node';
export declare type HtmlNode = FlowNode & {
    type: NodeType.HTML;
    link?: string;
    linkedField?: string;
    links?: string[];
    parsedLink?: string;
};
export interface MultipleHtmlNode extends BranchNode {
    type: NodeType.HTML;
    links?: string[];
}
export interface HtmlParseResult {
    html: string;
    url: string;
}
export interface LinkParseResult {
    page: Page;
    parsedLink: string;
}
