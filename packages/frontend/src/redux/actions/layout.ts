import {
    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    ADD_NOTIFICATION
} from '../constants/layout'
import { Notification } from 'reducers/layout'

export interface OpenSidebar {
    type: typeof OPEN_SIDEBAR
}

export const openSidebar = () => {
    return {
        type: OPEN_SIDEBAR
    }
}

export interface CloseSidebar {
    type: typeof CLOSE_SIDEBAR
}

export const closeSidebar = () => {
    return {
        type: CLOSE_SIDEBAR
    }
}

export interface AddNotification {
    type: typeof ADD_NOTIFICATION
    payload: Notification
}

export const addNotification = (notification: Notification) => {
    return {
        type: ADD_NOTIFICATION,
        payload: notification
    }
}

export type Actions = OpenSidebar | CloseSidebar | AddNotification
