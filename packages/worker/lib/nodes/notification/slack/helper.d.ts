import { NodeInput, TraverseOptions, UploadedFile } from '../../../typedefs/node';
import { SlackNode, SlackMessage } from './typedefs';
export declare const getMessage: (input: NodeInput<SlackNode, UploadedFile, any>, options: TraverseOptions) => SlackMessage;
