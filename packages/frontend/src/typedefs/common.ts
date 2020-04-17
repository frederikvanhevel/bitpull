import { FlowNode } from '@bitpull/worker/lib/typedefs'

export type Node<T = FlowNode> = T & {
    parent?: FlowNode
}
