import { FlowNode, NodeId, NodeType } from '../../../typedefs/node'
import { HTMLSelector } from '../selectors'

export interface NextLinkPagination {
    nextLink: HTMLSelector
}

export interface PageRangePagination {
    pageRange: string
}

export interface LinkListPagination {
    linkList: string
    prependUrl: boolean
}

export type PaginationTypes =
    | NextLinkPagination
    | PageRangePagination
    | LinkListPagination

export type PaginationNode = FlowNode & {
    type: NodeType.PAGINATION
    goToPerPage: NodeId
    gotoOnEnd: NodeId
    pagination: PaginationTypes
    linkLimit?: number
}

export type PaginationParseResult = object[]
