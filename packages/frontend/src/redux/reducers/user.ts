import LoginConstants from '../constants/user'
import { Actions } from '../actions/user'
import { User } from 'queries/user/typedefs'

export interface UserState {
    user?: User
    initializing: boolean
    loading: boolean
    error?: Error
}

const initialState: UserState = {
    initializing: true,
    loading: false
}

export default (state = initialState, action: Actions): UserState => {
    switch (action.type) {
        case LoginConstants.LOAD_USER:
            return {
                ...state,
                initializing: true
            }
        case LoginConstants.LOAD_USER_FAILED:
            return {
                ...state,
                initializing: false,
                error: action.payload
            }
        case LoginConstants.LOAD_USER_SUCCESS:
            return {
                ...state,
                initializing: false,
                user: action.payload
            }
        case LoginConstants.LOGIN:
            return {
                ...state,
                loading: true
            }
        case LoginConstants.LOGIN_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LoginConstants.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        case LoginConstants.OAUTH:
            return {
                ...state,
                loading: true
            }
        case LoginConstants.OAUTH_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LoginConstants.OAUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        case LoginConstants.REGISTER:
            return {
                ...state,
                loading: true
            }
        case LoginConstants.REGISTER_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LoginConstants.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        case LoginConstants.VERIFY_EMAIL:
            return {
                ...state,
                loading: true
            }
        case LoginConstants.VERIFY_EMAIL_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LoginConstants.VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                user:
                    {
                        ...state.user,
                        verified: true
                    } as User
            }
        case LoginConstants.UPDATE_INFORMATION:
            return {
                ...state,
                loading: true
            }
        case LoginConstants.UPDATE_INFORMATION_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LoginConstants.UPDATE_INFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        case LoginConstants.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state
    }
}
