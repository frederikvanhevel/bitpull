import { AuthenticationContext } from 'controllers/graphql/directives/auth'

export interface AuthroizationCode {
    code: string
}

export type AuthorizationHandler = (
    context: AuthenticationContext,
    data: AuthroizationCode | any
) => void
