import { NodeType } from '../../typedefs/node'

type Map = {
    processing: NodeType[]
    export: NodeType[]
    notification: NodeType[]
}

const NodeMap: Record<NodeType, Map> = {
    [NodeType.HTML]: {
        processing: [
            NodeType.COLLECT,
            NodeType.PAGINATION,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF,
            NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [NodeType.XML]: {
        processing: [
            NodeType.COLLECT,
            NodeType.PAGINATION,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF,
            NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [NodeType.COLLECT]: {
        processing: [NodeType.HTML, NodeType.XML],
        export: [NodeType.EXCEL, NodeType.JSON, NodeType.WEBHOOK],
        notification: []
    },
    [NodeType.PAGINATION]: {
        processing: [
            NodeType.COLLECT,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF,
            NodeType.WAIT
        ],
        export: [
            NodeType.STORAGE,
            NodeType.WEBHOOK,
            NodeType.DROPBOX,
            NodeType.GOOGLE_DRIVE,
            NodeType.ONEDRIVE,
            NodeType.GITHUB
        ],
        notification: []
    },
    [NodeType.CLICK]: {
        processing: [
            NodeType.COLLECT,
            NodeType.PAGINATION,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF,
            NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [NodeType.LOGIN]: {
        processing: [
            NodeType.COLLECT,
            NodeType.PAGINATION,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF,
            NodeType.WAIT
        ],
        export: [],
        notification: []
    },
    [NodeType.EXCEL]: {
        processing: [],
        export: [
            NodeType.STORAGE,
            NodeType.WEBHOOK,
            NodeType.DROPBOX,
            NodeType.GOOGLE_DRIVE,
            NodeType.ONEDRIVE,
            NodeType.GITHUB
        ],
        notification: []
    },
    [NodeType.JSON]: {
        processing: [],
        export: [
            NodeType.STORAGE,
            NodeType.WEBHOOK,
            NodeType.DROPBOX,
            NodeType.GOOGLE_DRIVE,
            NodeType.ONEDRIVE,
            NodeType.GITHUB
        ],
        notification: []
    },
    [NodeType.SCREENSHOT]: {
        processing: [],
        export: [
            NodeType.STORAGE,
            NodeType.WEBHOOK,
            NodeType.DROPBOX,
            NodeType.GOOGLE_DRIVE,
            NodeType.ONEDRIVE,
            NodeType.GITHUB
        ],
        notification: []
    },
    [NodeType.PDF]: {
        processing: [],
        export: [
            NodeType.STORAGE,
            NodeType.WEBHOOK,
            NodeType.DROPBOX,
            NodeType.GOOGLE_DRIVE,
            NodeType.ONEDRIVE,
            NodeType.GITHUB
        ],
        notification: []
    },
    [NodeType.WAIT]: {
        processing: [
            NodeType.COLLECT,
            NodeType.PAGINATION,
            NodeType.CLICK,
            NodeType.LOGIN,
            NodeType.SCREENSHOT,
            NodeType.PDF
        ],
        export: [],
        notification: []
    },
    [NodeType.FUNCTION]: {
        processing: [],
        export: [],
        notification: []
    },
    [NodeType.DROPBOX]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.GOOGLE_DRIVE]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.ONEDRIVE]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.GITHUB]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.STORAGE]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.WEBHOOK]: {
        processing: [],
        export: [],
        notification: [NodeType.EMAIL, NodeType.SLACK]
    },
    [NodeType.SLACK]: {
        processing: [],
        export: [],
        notification: []
    },
    [NodeType.EMAIL]: {
        processing: [],
        export: [],
        notification: []
    }
}

export default NodeMap
