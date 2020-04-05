import {
    SET_FILTER,
    STORAGE_ITEM_ADDED,
    CLEAR_NEW_ITEMS
} from '../constants/storage'
import { Actions } from '../actions/storage'
import { ResourceType } from 'typedefs/graphql'

export interface StorageState {
    filter: ResourceType
    newItems: number
}

const initialState: StorageState = {
    filter: ResourceType.JOB,
    newItems: 0
}

export default (state = initialState, action: Actions): StorageState => {
    switch (action.type) {
        case SET_FILTER:
            return { ...state, filter: action.payload }
        case STORAGE_ITEM_ADDED:
            return { ...state, newItems: state.newItems + 1 }
        case CLEAR_NEW_ITEMS:
            return { ...state, newItems: 0 }
        default:
            return state
    }
}
