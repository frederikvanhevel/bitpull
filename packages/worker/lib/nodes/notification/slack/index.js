"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const common_1 = require("../../../utils/common");
const common_2 = require("../../../typedefs/common");
const errors_1 = require("../../common/errors");
const errors_2 = require("./errors");
const helper_1 = require("./helper");
const SLACK_METHOD_URL = 'https://slack.com/api/chat.postMessage';
const slack = async (input, options) => {
    const { integrations = [], onLog } = options;
    const { node } = input;
    const slackIntegration = integrations.find(integration => integration.type === common_2.IntegrationType.SLACK);
    common_1.assert(slackIntegration, errors_1.IntegrationError.INTEGRATION_MISSING);
    common_1.assert(slackIntegration.active, errors_1.IntegrationError.INTEGRATION_INACTIVE);
    common_1.assert(slackIntegration.settings.access_token, errors_1.IntegrationError.ACCESS_TOKEN_MISSING);
    common_1.assert(node.channel, errors_2.SlackError.CHANNEL_MISSING);
    common_1.assert(!node.children || !node.children.length, errors_1.NodeError.NO_CHILDREN_ALLOWED);
    const result = await request_promise_native_1.default({
        uri: SLACK_METHOD_URL,
        method: 'POST',
        body: Object.assign({ channel: node.channel }, helper_1.getMessage(input, options)),
        json: true,
        headers: {
            Authorization: `Bearer ${slackIntegration.settings.access_token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (!result.ok) {
        if (onLog)
            onLog(node, 'Unable to send slack message', common_2.LogType.WARN);
    }
    if (onLog)
        onLog(node, `Sent slack message to channel #${node.channel}`);
    return input;
};
exports.default = slack;
//# sourceMappingURL=index.js.map