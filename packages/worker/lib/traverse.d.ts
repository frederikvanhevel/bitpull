import { NodeInput, TraverseOptions, FlowNode } from './typedefs/node';
import { ParseResult } from './typedefs/common';
import CustomBrowser from './browser';
declare class Traverser {
    private options;
    private context;
    private canceled;
    private errorCount;
    constructor(options?: TraverseOptions, browser?: CustomBrowser);
    private getNodeResult;
    parseNode(input: NodeInput<FlowNode>): Promise<NodeInput<FlowNode>>;
    run(node: FlowNode): Promise<ParseResult>;
    cancel(): void;
    forceCancel(): Promise<void>;
    cleanup(): Promise<void>;
}
export default Traverser;
