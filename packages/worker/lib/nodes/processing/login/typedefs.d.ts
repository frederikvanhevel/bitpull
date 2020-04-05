import { FlowNode, NodeType } from '../../../typedefs/node';
interface LoginCredentials {
    username: {
        selector: string;
        value: string;
        encrypted?: boolean;
    };
    password: {
        selector: string;
        value: string;
        encrypted?: boolean;
    };
    submit: string;
}
export declare type LoginNode = FlowNode & {
    type: NodeType.LOGIN;
    credentials: LoginCredentials;
    delay?: number;
    waitForNavigation?: boolean;
};
export {};
