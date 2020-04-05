import { getActiveIntegrations_getActiveIntegrations } from './typedefs/getActiveIntegrations'

export type Integration = Omit<
    getActiveIntegrations_getActiveIntegrations,
    '__typename'
>
