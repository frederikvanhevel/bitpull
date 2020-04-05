import { useSnackbar } from 'notistack'
import { getActiveIntegrations } from 'queries/integration/typedefs/getActiveIntegrations'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_INTEGRATIONS, Integration } from 'queries/integration'
import { toggleIntegration } from 'mutations/integration/typedefs/toggleIntegration'
import { TOGGLE_INTEGRATION, REMOVE_INTEGRATION } from 'mutations/integration'
import { removeIntegration } from 'mutations/integration/typedefs/removeIntegration'

type Props = {
    loading: boolean
    integrations: Integration[]
    toggle: (integration: Integration) => void
    remove: (integration: Integration) => void
}

const useIntegrations = (): Props => {
    const { enqueueSnackbar } = useSnackbar()
    const { data, loading } = useQuery<getActiveIntegrations>(
        GET_INTEGRATIONS,
        {
            fetchPolicy: 'cache-and-network'
        }
    )
    const [toggleMutation] = useMutation<toggleIntegration>(
        TOGGLE_INTEGRATION,
        {
            onError: () => {
                enqueueSnackbar('Could not toggle integration', {
                    variant: 'error'
                })
            }
        }
    )
    const [removeMutation] = useMutation<removeIntegration>(
        REMOVE_INTEGRATION,
        {
            onError: () => {
                enqueueSnackbar('Could not remove integration', {
                    variant: 'error'
                })
            }
        }
    )

    const integrations = data ? data.getActiveIntegrations : []

    const toggle = (integration: Integration) => {
        toggleMutation({
            variables: {
                id: integration._id,
                enabled: !integration.active
            },
            optimisticResponse: {
                toggleIntegration: true
            },
            update: cache => {
                const oldIntegrations = cache.readQuery<getActiveIntegrations>({
                    query: GET_INTEGRATIONS
                })
                cache.writeQuery({
                    query: GET_INTEGRATIONS,
                    data: {
                        getActiveIntegrations: oldIntegrations!.getActiveIntegrations.map(
                            item =>
                                item._id === integration._id
                                    ? {
                                          ...integration,
                                          active: !item.active
                                      }
                                    : item
                        )
                    }
                })
            }
        })
    }

    const remove = (integration: Integration) => {
        removeMutation({
            variables: {
                id: integration._id
            },
            optimisticResponse: {
                removeIntegration: true
            },
            update: cache => {
                const oldIntegrations = cache.readQuery<getActiveIntegrations>({
                    query: GET_INTEGRATIONS
                })
                cache.writeQuery({
                    query: GET_INTEGRATIONS,
                    data: {
                        getActiveIntegrations: oldIntegrations!.getActiveIntegrations.filter(
                            item => item._id !== integration._id
                        )
                    }
                })
            }
        })
    }

    return { loading: !data && loading, integrations, toggle, remove }
}

export default useIntegrations
