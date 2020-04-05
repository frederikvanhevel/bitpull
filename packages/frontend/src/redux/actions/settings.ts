import SettingsConstants from 'redux/constants/settings'
import { UserSettings } from 'queries/user/typedefs'
import { LoadUserSuccess } from './user'

export interface UpdateSettings {
    type: typeof SettingsConstants.UPDATE_SETTINGS
    payload: Partial<UserSettings>
    current: UserSettings
}

export interface UpdateSettingsFailed {
    type: typeof SettingsConstants.UPDATE_SETTINGS_FAILED
    payload: UserSettings
}

export interface UpdateSettingsSuccess {
    type: typeof SettingsConstants.UPDATE_SETTINGS_SUCCESS
}

export const updateSettings = (
    newSettings: Partial<UserSettings>,
    currentSettings: UserSettings
) => {
    return {
        type: SettingsConstants.UPDATE_SETTINGS,
        payload: newSettings,
        current: { ...currentSettings }
    }
}

export type Actions =
    | LoadUserSuccess
    | UpdateSettings
    | UpdateSettingsSuccess
    | UpdateSettingsFailed
