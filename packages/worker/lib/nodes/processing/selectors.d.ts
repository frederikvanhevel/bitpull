import { Page } from 'puppeteer';
import { NodeInput } from '../../typedefs/node';
import { Settings } from '../../typedefs/common';
import { CollectNode } from './collect/typedefs';
import { HtmlParseResult } from './html/typedefs';
export interface HTMLSelector {
    value: string;
    attribute?: string;
}
export declare const getFieldFromPage: (page: Page, selector: HTMLSelector, url?: string | undefined, xmlMode?: boolean) => Promise<string | undefined>;
export declare const getFieldsFromHtml: (input: NodeInput<CollectNode, any, HtmlParseResult>, settings: Settings, xmlMode?: boolean) => Promise<Record<string, string | number> | Record<string, string | number>[]>;
