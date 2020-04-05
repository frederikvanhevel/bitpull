import React, { useEffect } from 'react'
import { useLocation, useParams, Redirect } from 'react-router-dom'
import queryString from 'query-string'
import Loader from 'components/ui/Loader'
import ErrorScreen from 'components/ui/ErrorScreen'
import { useMutation } from '@apollo/react-hooks'
import { authorize } from 'mutations/integration/typedefs/authorize'
import { AUTHORIZE_INTEGRATION } from 'mutations/integration'

const IntegrationLoader: React.FC = () => {
    const location = useLocation()
    const { type } = useParams()
    const query = queryString.parse(location.search)
    const [authorizeIntegration, { data, loading, error }] = useMutation<
        authorize
    >(AUTHORIZE_INTEGRATION, {
        variables: {
            type: type!.toUpperCase().replace('-', '_'),
            data: query
        }
    })

    useEffect(() => {
        if (!data && !loading && !error) authorizeIntegration()
    }, [type, query])

    if (loading) return <Loader text="Activating ..." />
    if (error) return <ErrorScreen />
    if (data && data.authorize) return <Redirect to="/integrations" />

    return null
}

export default IntegrationLoader
