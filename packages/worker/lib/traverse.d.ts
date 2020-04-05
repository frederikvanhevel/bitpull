import { NodeInput, TraverseOptions, FlowNode } from './typedefs/node';
import { ParseResult } from './typedefs/common';
declare class Traverser {
    private options;
    private context;
    private canceled;
    private errorCount;
    constructor(options?: TraverseOptions);
    private getNodeResult;
    parseNode(input: NodeInput<FlowNode>): Promise<NodeInput<FlowNode>>;
    run(node: FlowNode): Promise<ParseResult>;
    cancel(): void;
    forceCancel(): Promise<void>;
    cleanup(): Promise<void>;
}
export default Traverser;
