import { VariantType } from 'notistack'
import {
    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    ADD_NOTIFICATION
} from '../constants/layout'
import { Actions } from '../actions/layout'

export enum NotificationAction {
    INTEGRATION_MISSING = 'INTEGRATION_MISSING',
    INTEGRATION_INACTIVE = 'INTEGRATION_INACTIVE'
}

export interface Notification {
    type: VariantType
    message: string
    action?: NotificationAction
}

export interface LayoutState {
    isSidebarOpen: boolean
    notifications: Notification[]
}

const initialState: LayoutState = {
    isSidebarOpen: true,
    notifications: []
}

export default (state = initialState, action: Actions): LayoutState => {
    switch (action.type) {
        case OPEN_SIDEBAR:
            return { ...state, isSidebarOpen: true }
        case CLOSE_SIDEBAR:
            return { ...state, isSidebarOpen: false }
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            }
        default:
            return state
    }
}
