import { FlowNode, NodeType, NodeInput } from '../../typedefs/node'
import { HtmlNode } from '../../nodes/processing/html/typedefs'
import { IntegrationType } from '../../typedefs/common'

export function createNode<T = FlowNode>(
    type: NodeType,
    extra: object = {},
    callback?: Function
): T {
    const node = {
        type,
        ...extra
    }

    if (callback) {
        // @ts-ignore
        return {
            ...node,
            children: [
                {
                    type: NodeType.FUNCTION,
                    function: callback
                }
            ]
        }
    }

    // @ts-ignore
    return node
}

export function createInput<T>(
    node: FlowNode,
    passedData?: any,
    rootAncestor?: HtmlNode
): NodeInput<FlowNode, any, any> {
    return {
        node,
        passedData,
        rootAncestor
    }
}

export const createIntegration = (type: IntegrationType) => {
    return {
        type,
        active: true,
        settings: {
            access_token: 'token'
        }
    }
}
