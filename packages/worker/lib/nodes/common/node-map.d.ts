import { NodeType } from '../../typedefs/node';
declare type Map = {
    processing: NodeType[];
    export: NodeType[];
    notification: NodeType[];
};
declare const NodeMap: Record<NodeType, Map>;
export default NodeMap;
