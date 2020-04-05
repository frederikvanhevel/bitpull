import { FlowNode, NodeType } from '../../../typedefs/node'

export enum RequestMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export type WebhookNode = FlowNode & {
    type: NodeType.WEBHOOK
    method: RequestMethod
    path: string
}
