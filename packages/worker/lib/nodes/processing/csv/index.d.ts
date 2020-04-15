import { NodeParser } from '../../../typedefs/node';
import { FileWriteResult } from '../../../utils/file';
import { CsvNode } from './typedefs';
declare const csv: NodeParser<CsvNode, FileWriteResult>;
export default csv;
