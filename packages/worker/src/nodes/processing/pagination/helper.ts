import { getUriOrigin } from '../../../utils/common'
import {
    PaginationTypes,
    NextLinkPagination,
    LinkListPagination
} from './typedefs'

export const getFullUrl = (url: string, rootUrl: string) => {
    if (url.startsWith('/')) {
        return getUriOrigin(rootUrl) + url
    } else if (url.startsWith('?')) {
        return rootUrl + url
    }
    return url
}

export const isNextLinkPagination = (
    pagination: PaginationTypes
): pagination is NextLinkPagination => {
    if ((pagination as NextLinkPagination).nextLink) {
        return true
    }
    return false
}

export const isLinkListPagination = (
    pagination: PaginationTypes
): pagination is LinkListPagination => {
    if ((pagination as LinkListPagination).linkList) {
        return true
    }
    return false
}
