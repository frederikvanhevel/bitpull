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
    csvIcon,
    jsonIcon,
    storageIcon,
    loginIcon,
    waitIcon,
    disabledIcon,
    emailIcon,
    githubIcon,
    scrollIcon
} from './icons'

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
    [NodeType.CSV]: 'csv file',
    [NodeType.JSON]: 'json file',
    [NodeType.PDF]: 'pdf file',
    [NodeType.SCREENSHOT]: 'screenshot',
    [NodeType.WAIT]: 'wait',
    [NodeType.SCROLL]: 'scroll',
    [NodeType.LOGIN]: 'login',
    [NodeType.FUNCTION]: 'function'
}

const NODE_ICONS: Record<NodeType, ReactNode> = {
    [NodeType.HTML]: urlIcon,
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
    [NodeType.CSV]: csvIcon,
    [NodeType.JSON]: jsonIcon,
    [NodeType.PDF]: pdfIcon,
    [NodeType.SCREENSHOT]: screenshotIcon,
    [NodeType.WAIT]: waitIcon,
    [NodeType.SCROLL]: scrollIcon,
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
    if (node.type === NodeType.HTML) {
        const htmlNode = node as HtmlNode
        const link = htmlNode.linkedField
            ? `{{${htmlNode.linkedField}}}`
            : getHostname(htmlNode.link!)
        return !!link && link !== '' ? link : 'Enter a url'
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
    return node.type === NodeType.HTML && (node as HtmlNode).link !== undefined
}
