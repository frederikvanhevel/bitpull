import { ReactNode } from 'react'
import { FlowNode } from '@bitpull/worker/lib/typedefs'

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

export enum TooltipType {
    BRANCH_UP = 'BRANCH_UP',
    BRANCH_UP_HTML = 'BRANCH_UP_HTML',
    BRANCH_UP_PAGINATION = 'BRANCH_UP_PAGINATION',
    BRANCH_DOWN = 'BRANCH_DOWN',
    BRANCH_DOWN_PAGINATION = 'BRANCH_DOWN_PAGINATION',
    BRANCH_DOWN_CLICK = 'BRANCH_DOWN_CLICK'
}

export interface Position {
    x: number
    y: number
}

export interface Tooltip {
    type: TooltipType
    position: Position
}

export interface ChartOptions {
    classes: ChartClasses
    getNodeClass: (node: FlowNode) => string
    getNodeText: (node: FlowNode) => string
    getNodeIcon: (node: FlowNode) => ReactNode
    onClickNode: (node: FlowNode) => void
    isLinkDotted: (node: FlowNode) => boolean
    onShowTooltip: (tooltip: Tooltip) => void
    onHideTooltip: () => void
}
