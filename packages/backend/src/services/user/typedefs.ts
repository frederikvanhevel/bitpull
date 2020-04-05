import { User } from 'models/user'

export interface LoginResponse {
    user: User
    token: string
}
