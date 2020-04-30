import {
    PaginationTypes,
    NextLinkPagination,
    LinkListPagination
} from '@bitpull/worker/lib/nodes/processing/pagination/typedefs'

export const isNextLinkPagination = (
    pagination: PaginationTypes
): pagination is NextLinkPagination => {
    return (pagination as NextLinkPagination).nextLink !== undefined
}

export const isLinkListPagination = (
    pagination: PaginationTypes
): pagination is LinkListPagination => {
    return (pagination as LinkListPagination).linkList !== undefined
}
