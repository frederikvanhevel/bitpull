import React, { useEffect } from 'react'
import querystring from 'query-string'
import { useLocation, Redirect, useHistory } from 'react-router-dom'
import { OAuthProvider } from 'typedefs/graphql'
import { useDispatch, useSelector } from 'react-redux'
import { oAuth } from 'actions/user'
import { AppState } from 'redux/store'
import { UserState } from 'reducers/user'
import Loader from 'components/ui/Loader'
import { RouterState } from 'components/navigation/PrivateRoute'

const OAuthCallback: React.FC = () => {
    const history = useHistory()
    const { state: routerState, search } = useLocation<
        RouterState | undefined
    >()
    const query = querystring.parse(search)
    const dispatch = useDispatch()
    const { user, error } = useSelector<AppState, UserState>(
        state => state.user
    )

    useEffect(() => {
        if (error) history.push('/login')
    }, [error])

    useEffect(() => {
        dispatch(
            oAuth({
                provider: OAuthProvider.GOOGLE,
                code: query.code as string,
                referralId: query.state as string
            })
        )
    }, [])

    if (user) return <Redirect to={routerState?.from || '/'} />

    return <Loader fullPage />
}

export default OAuthCallback
