import React, { ElementType } from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router'
import { AppState } from 'redux/store'

type Props = RouteProps & {
    component: ElementType
}

export type RouterState = {
    from: string
}

const PrivateRoute: React.FC<Props> = props => {
    const { user } = useSelector((state: AppState) => state.user)

    return (
        <Route
            path={props.path}
            exact={props.exact}
            render={renderProps => {
                if (user) {
                    if (!user.verified) {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/verify-email',
                                    state: { from: renderProps.location }
                                }}
                            />
                        )
                    }
                    return <props.component {...renderProps} />
                }

                return (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: renderProps.location }
                        }}
                    />
                )
            }}
        />
    )
}

export default PrivateRoute
