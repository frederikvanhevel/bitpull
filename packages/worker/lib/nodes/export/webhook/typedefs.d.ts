import { FlowNode, NodeType } from '../../../typedefs/node';
export declare enum RequestMethod {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare type WebhookNode = FlowNode & {
    type: NodeType.WEBHOOK;
    method: RequestMethod;
    path: string;
};
