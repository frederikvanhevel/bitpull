import {
    SET_FILTER,
    STORAGE_ITEM_ADDED,
    CLEAR_NEW_ITEMS
} from '../constants/storage'
import { ResourceType } from 'typedefs/graphql'

export interface SetFilter {
    type: typeof SET_FILTER
    payload: ResourceType
}

export const setFilter = (resourceType: ResourceType) => {
    return {
        type: SET_FILTER,
        payload: resourceType
    }
}

export interface StorageItemAdded {
    type: typeof STORAGE_ITEM_ADDED
    payload: ResourceType
}

export const storageItemAdded = () => {
    return {
        type: STORAGE_ITEM_ADDED
    }
}

export interface ClearNewStorageItems {
    type: typeof CLEAR_NEW_ITEMS
}

export const clearNewStorageItems = () => {
    return {
        type: CLEAR_NEW_ITEMS
    }
}

export type Actions = SetFilter | StorageItemAdded | ClearNewStorageItems
