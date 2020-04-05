import { FileWriteResult } from '../../../utils/file';
import { NodeParser } from '../../../typedefs/node';
import { WaitNode } from './typedefs';
declare const wait: NodeParser<WaitNode, FileWriteResult>;
export default wait;
