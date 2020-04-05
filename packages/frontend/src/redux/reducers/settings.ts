import LoginConstants from '../constants/user'
import { Actions } from '../actions/settings'
import { UserSettings } from 'queries/user/typedefs'
import SettingsConstants from 'redux/constants/settings'

const initialState: UserSettings = {
    failedJobEmail: true
}

export default (state = initialState, action: Actions): UserSettings => {
    switch (action.type) {
        case LoginConstants.LOAD_USER_SUCCESS:
            return { ...action.payload.settings }
        case SettingsConstants.UPDATE_SETTINGS:
            return Object.assign({}, state, action.payload)
        case SettingsConstants.UPDATE_SETTINGS_FAILED:
            return { ...action.payload }
        default:
            return state
    }
}
