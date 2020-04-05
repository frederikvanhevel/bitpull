"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../utils/common");
exports.getFullUrl = (url, rootUrl) => {
    if (url.startsWith('/')) {
        return common_1.getUriOrigin(rootUrl) + url;
    }
    else if (url.startsWith('?')) {
        return rootUrl + url;
    }
    return url;
};
exports.isNextLinkPagination = (pagination) => {
    if (pagination.nextLink) {
        return true;
    }
    return false;
};
exports.isLinkListPagination = (pagination) => {
    if (pagination.linkList) {
        return true;
    }
    return false;
};
