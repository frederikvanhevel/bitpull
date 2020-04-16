import { NodeType, FlowNode, NodeParser } from '../typedefs/node';
export declare const IMPORT_PATHS: Record<NodeType, string>;
export declare const isRootNode: (node: FlowNode) => boolean;
export declare const getModule: (type: NodeType) => Promise<NodeParser<FlowNode, any, any>>;
export declare const isFileNode: (type: NodeType) => boolean;
export declare const isExportNode: (type: NodeType) => boolean;
export declare const hasChildExportNodes: (node: FlowNode) => FlowNode | undefined;
