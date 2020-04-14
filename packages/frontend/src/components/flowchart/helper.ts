import { ReactNode } from 'react'
import { NodeType, NodeId, HtmlNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import {
    watchIcon,
    urlIcon,
    collectIcon,
    paginateIcon,
    clickIcon,
    pdfIcon,
    screenshotIcon,
    webhookIcon,
    slackIcon,
    dropboxIcon,
    googleDriveIcon,
    onedriveIcon,
    excelIcon,
    jsonIcon,
    storageIcon,
    loginIcon,
    waitIcon,
    disabledIcon,
    emailIcon,
    githubIcon
} from './icons'
import { Theme } from '@material-ui/core'

export interface ChartClasses {
    node: any
    link: any
    info: any
    icon: any
    primaryNode: any
    secondaryNode: any
    defaultNode: any
    activeNode: any
    selectedLink: any
    selectedNode: any
    unClickable: any
    errorNode: any
    disabledNode: any
    unreachableNode: any
    watchedNode: any
}

const NODE_LABELS: Record<NodeType, string> = {
    [NodeType.HTML]: 'html',
    [NodeType.XML]: 'xml',
    [NodeType.COLLECT]: 'collect',
    [NodeType.PAGINATION]: 'pagination',
    [NodeType.WEBHOOK]: 'webhook',
    [NodeType.CLICK]: 'click element',
    [NodeType.SLACK]: 'slack',
    [NodeType.EMAIL]: 'email',
    [NodeType.DROPBOX]: 'dropbox',
    [NodeType.STORAGE]: 'storage',
    [NodeType.GOOGLE_DRIVE]: 'google drive',
    [NodeType.ONEDRIVE]: 'onedrive',
    [NodeType.GITHUB]: 'github',
    [NodeType.EXCEL]: 'excel file',
    [NodeType.JSON]: 'json file',
    [NodeType.PDF]: 'pdf file',
    [NodeType.SCREENSHOT]: 'screenshot',
    [NodeType.WAIT]: 'wait',
    [NodeType.LOGIN]: 'login',
    [NodeType.FUNCTION]: 'function'
}

const NODE_ICONS: Record<NodeType, ReactNode> = {
    [NodeType.HTML]: urlIcon,
    [NodeType.XML]: urlIcon,
    [NodeType.COLLECT]: collectIcon,
    [NodeType.PAGINATION]: paginateIcon,
    [NodeType.WEBHOOK]: webhookIcon,
    [NodeType.CLICK]: clickIcon,
    [NodeType.SLACK]: slackIcon,
    [NodeType.EMAIL]: emailIcon,
    [NodeType.DROPBOX]: dropboxIcon,
    [NodeType.STORAGE]: storageIcon,
    [NodeType.GOOGLE_DRIVE]: googleDriveIcon,
    [NodeType.ONEDRIVE]: onedriveIcon,
    [NodeType.GITHUB]: githubIcon,
    [NodeType.EXCEL]: excelIcon,
    [NodeType.JSON]: jsonIcon,
    [NodeType.PDF]: pdfIcon,
    [NodeType.SCREENSHOT]: screenshotIcon,
    [NodeType.WAIT]: waitIcon,
    [NodeType.LOGIN]: loginIcon,
    [NodeType.FUNCTION]: urlIcon
}

export const getNodeIcon = (node: Node, watchedNodeId?: NodeId): ReactNode => {
    if (node.disabled) {
        return disabledIcon
    }

    if (watchedNodeId && node.id === watchedNodeId) {
        return watchIcon
    }

    return NODE_ICONS[node!.type as NodeType]
}

const getHostname = (link: string) => {
    try {
        const url = new URL(link)
        return url.hostname.replace('www.', '')
    } catch (error) {
        return link
    }
}

export const getNodeText = (node: Node): string => {
    if (node.type === NodeType.HTML || node.type === NodeType.XML) {
        const htmlNode = node as HtmlNode
        const link = htmlNode.linkedField
            ? `{{${htmlNode.linkedField}}}`
            : getHostname(htmlNode.link!)
        return link || 'Enter a url'
    }

    return NODE_LABELS[node!.type as NodeType]
}

export const isLinkDotted = (link: any) => {
    return (
        link.target.data.type === NodeType.SLACK ||
        link.target.data.type === NodeType.EMAIL
    )
}

export const isRootNode = (node: Node) => {
    return node.type === NodeType.HTML || node.type === NodeType.XML
}

export const getStyles = (theme: Theme): ChartClasses => ({
    node: {
        '& rect': {
            rx: 4,
            ry: 4
        },
        '& text': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '16px'
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    primaryNode: {
        '& rect': {
            fill: theme.palette.primary.main
        },
        '& rect:hover': {
            fill: theme.palette.primary.dark
        },
        '& text': {
            fill: theme.palette.primary.contrastText
        },
        '& path': {
            fill: theme.palette.primary.contrastText
        }
    },
    secondaryNode: {
        '& rect': {
            fill: theme.palette.secondary.main
        },
        '& rect:hover': {
            fill: theme.palette.secondary.dark
        },
        '& text': {
            fill: theme.palette.secondary.contrastText
        },
        '& path': {
            fill: theme.palette.secondary.contrastText
        }
    },
    defaultNode: {
        '& rect': {
            fill: theme.palette.grey['100'],
            stroke: theme.palette.grey['300']
        },
        '& rect:hover': {
            fill: theme.palette.grey['300'],
            stroke: theme.palette.grey['500']
        },
        '& text': {
            fill: theme.palette.grey['800']
        },
        '& path': {
            fill: theme.palette.grey['800']
        }
    },
    activeNode: {
        '& rect': {
            fill: `${theme.palette.secondary.main} !important`
        },
        '& text': {
            fill: `${theme.palette.secondary.contrastText} !important`
        },
        '& path': {
            fill: `${theme.palette.secondary.contrastText} !important`
        }
    },
    link: {
        fill: 'none',
        stroke: theme.palette.grey['500'],
        strokeWidth: '2px'
    },
    selectedLink: {
        stroke: `${theme.palette.grey['800']} !important`,
        strokeWidth: '4px !important'
    },
    selectedNode: {
        '& rect': {
            filter: 'url(#drop-shadow)'
        }
    },
    unClickable: {
        '& rect': {
            pointerEvents: 'none'
        }
    },
    errorNode: {
        '& rect': {
            fill: theme.palette.error.main,
            stroke: theme.palette.error.dark,
            strokeWidth: '2px'
        },
        '& rect:hover': {
            fill: theme.palette.error.dark,
            stroke: theme.palette.error.dark,
            strokeWidth: '2px'
        },
        '& text': {
            fill: theme.palette.error.contrastText
        },
        '& path': {
            fill: theme.palette.error.contrastText
        }
    },
    disabledNode: {
        '& rect': {
            fill: theme.palette.grey['200'],
            stroke: theme.palette.grey['300']
        },
        '& rect:hover': {
            fill: theme.palette.grey['200'],
            stroke: theme.palette.grey['300']
        },
        '& text': {
            fill: theme.palette.grey['400']
        },
        '& path': {
            fill: theme.palette.grey['400']
        }
    },
    unreachableNode: {
        '& rect': {
            fill: theme.palette.grey['50'],
            stroke: theme.palette.grey['200'],
            strokeWidth: '1px'
        },
        '& text': {
            fill: theme.palette.grey['400']
        },
        '& path': {
            fill: theme.palette.grey['400']
        }
    },
    watchedNode: {
        '& rect': {
            stroke: theme.palette.grey['800'],
            strokeWidth: '2px'
        },
        '& rect:hover': {
            stroke: theme.palette.grey['800'],
            strokeWidth: '2px'
        }
    },
    info: {
        '& rect': {
            fill: '#ffffff',
            stroke: theme.palette.grey['500'],
            strokeWidth: '1px'
        },
        '& text': {
            fill: theme.palette.grey['500']
        }
    },
    icon: {
        fill: `${theme.palette.grey['500']} !important`
    }
})
