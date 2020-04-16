"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../typedefs/node");
const NodeMap = {
    [node_1.NodeType.HTML]: {
        processing: [
            node_1.NodeType.COLLECT,
            node_1.NodeType.PAGINATION,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF,
            node_1.NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [node_1.NodeType.XML]: {
        processing: [
            node_1.NodeType.COLLECT,
            node_1.NodeType.PAGINATION,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF,
            node_1.NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [node_1.NodeType.COLLECT]: {
        processing: [node_1.NodeType.HTML, node_1.NodeType.XML],
        export: [node_1.NodeType.EXCEL, node_1.NodeType.JSON, node_1.NodeType.CSV, node_1.NodeType.WEBHOOK],
        notification: []
    },
    [node_1.NodeType.PAGINATION]: {
        processing: [
            node_1.NodeType.COLLECT,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF,
            node_1.NodeType.WAIT
        ],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.CLICK]: {
        processing: [
            node_1.NodeType.COLLECT,
            node_1.NodeType.PAGINATION,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF,
            node_1.NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [node_1.NodeType.LOGIN]: {
        processing: [
            node_1.NodeType.HTML,
            node_1.NodeType.COLLECT,
            node_1.NodeType.PAGINATION,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF,
            node_1.NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [node_1.NodeType.EXCEL]: {
        processing: [],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.CSV]: {
        processing: [],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.JSON]: {
        processing: [],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.SCREENSHOT]: {
        processing: [],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.PDF]: {
        processing: [],
        export: [
            node_1.NodeType.STORAGE,
            node_1.NodeType.WEBHOOK,
            node_1.NodeType.DROPBOX,
            node_1.NodeType.GOOGLE_DRIVE,
            node_1.NodeType.ONEDRIVE,
            node_1.NodeType.GITHUB
        ],
        notification: []
    },
    [node_1.NodeType.WAIT]: {
        processing: [
            node_1.NodeType.HTML,
            node_1.NodeType.COLLECT,
            node_1.NodeType.PAGINATION,
            node_1.NodeType.CLICK,
            node_1.NodeType.LOGIN,
            node_1.NodeType.SCREENSHOT,
            node_1.NodeType.PDF
        ],
        export: [],
        notification: []
    },
    [node_1.NodeType.FUNCTION]: {
        processing: [],
        export: [],
        notification: []
    },
    [node_1.NodeType.DROPBOX]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.GOOGLE_DRIVE]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.ONEDRIVE]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.GITHUB]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.STORAGE]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.WEBHOOK]: {
        processing: [],
        export: [],
        notification: [node_1.NodeType.EMAIL, node_1.NodeType.SLACK]
    },
    [node_1.NodeType.SLACK]: {
        processing: [],
        export: [],
        notification: []
    },
    [node_1.NodeType.EMAIL]: {
        processing: [],
        export: [],
        notification: []
    }
};
exports.default = NodeMap;
