import { NodeParser } from '../../../typedefs/node';
import { HtmlParseResult } from '../html/typedefs';
import { WaitNode } from './typedefs';
declare const wait: NodeParser<WaitNode, undefined, HtmlParseResult>;
export default wait;
