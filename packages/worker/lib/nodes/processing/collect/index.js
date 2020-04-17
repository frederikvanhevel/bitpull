"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../utils/common");
const selectors_1 = require("../selectors");
const errors_1 = require("./errors");
const collect = (input, options) => {
    const { watchedNodeId, onWatch, onLog, settings } = options;
    const { node } = input;
    common_1.assert(node.fields && node.fields.length, errors_1.CollectError.FIELDS_MISSING);
    const parsedFields = selectors_1.getFieldsFromHtml(input, settings);
    if (onLog) {
        const fields = node.fields.map(field => field.label);
        onLog(node, `Collected fields [${fields}] from page`);
    }
    const data = node.append
        ? Object.assign(Object.assign({}, parsedFields), input.passedData) : parsedFields;
    if (onWatch && node.id === watchedNodeId)
        onWatch(data);
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: data }));
};
exports.default = collect;
//# sourceMappingURL=index.js.map