import { FlowNode } from '@bitpull/worker/lib/typedefs'

export interface Node extends FlowNode {
    parent?: FlowNode
}
