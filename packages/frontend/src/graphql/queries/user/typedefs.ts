import {
    getCurrentUser_getCurrentUser,
    getCurrentUser_getCurrentUser_settings
} from './typedefs/getCurrentUser'

export type User = Omit<getCurrentUser_getCurrentUser, '__typename'>
export type UserSettings = Omit<
    getCurrentUser_getCurrentUser_settings,
    '__typename'
>
