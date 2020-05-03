import { ReactNode } from 'react'
import {
    NodeType,
    NodeId,
    HtmlNode,
    MultipleHtmlNode,
    LinkedHtmlNode
} from '@bitpull/worker/lib/typedefs'
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
    scrollIcon,
    branchUp,
    branchDown
} from './icons'

export interface ChartClasses {
    node: any
    link: any
    info: any
    icon: any
    marker: any
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
    [NodeType.HTML_LINKED]: 'html',
    [NodeType.HTML_MULTIPLE]: 'html',
    [NodeType.COLLECT]: 'collect',
    [NodeType.PAGINATION]: 'pagination',
    [NodeType.WEBHOOK]: 'webhook',
    [NodeType.CLICK]: 'click element',
    [NodeType.CLICK_MULTIPLE]: 'click elements',
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
    [NodeType.HTML_LINKED]: urlIcon,
    [NodeType.HTML_MULTIPLE]: urlIcon,
    [NodeType.COLLECT]: collectIcon,
    [NodeType.PAGINATION]: paginateIcon,
    [NodeType.WEBHOOK]: webhookIcon,
    [NodeType.CLICK]: clickIcon,
    [NodeType.CLICK_MULTIPLE]: clickIcon,
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
        const link = getHostname(htmlNode.link!)
        return !!link && link !== '' ? link : 'Enter a url'
    } else if (node.type === NodeType.HTML_LINKED) {
        const htmlNode = node as LinkedHtmlNode
        return htmlNode.linkedField
            ? `{{${htmlNode.linkedField}}}`
            : 'select field'
    } else if (node.type === NodeType.HTML_MULTIPLE) {
        const htmlNode = node as MultipleHtmlNode
        const links = htmlNode.links
        return links?.length
            ? `${links.length} ${links.length === 1 ? 'link' : 'links'}`
            : 'Enter urls'
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
    return (
        (node.type === NodeType.HTML &&
            (node as HtmlNode).link !== undefined) ||
        node.type === NodeType.HTML_MULTIPLE
    )
}

export const isBranchLink = (link: any) => {
    return (
        link.source.data.type === NodeType.PAGINATION ||
        link.source.data.type === NodeType.HTML_MULTIPLE ||
        link.source.data.type === NodeType.CLICK_MULTIPLE ||
        (link.source.data.type === NodeType.COLLECT &&
            link.target.data.type === NodeType.HTML_LINKED)
    )
}

export const getMarker = (link: any) => {
    if (link.source.data.goToOnEnd === link.target.data.id) {
        return branchDown
    } else {
        return branchUp
    }
}
