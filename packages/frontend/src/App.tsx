import React, { useEffect } from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import MainWrapper from 'components/navigation/MainWrapper'
import { publicRoutes, privateRoutes, history } from 'pages/router'
import PrivateRoute from 'components/navigation/PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from 'actions/user'
import { AppState } from 'redux/store'
import Loader from 'components/ui/Loader'
import NotFoundPage from './pages/common/NotFoundPage'
import ErrorBoundary from 'components/navigation/ErrorBoundary'

const App: React.FC = () => {
    const dispatch = useDispatch()
    const { initializing } = useSelector((state: AppState) => state.user)

    useEffect(() => {
        dispatch(loadUser())
    }, [])

    if (initializing) return <Loader hideText delay={200} fullPage />

    return (
        <ErrorBoundary>
            <Router history={history}>
                <Switch>
                    {publicRoutes.map(route => (
                        <Route key={route.path} {...route} />
                    ))}

                    {privateRoutes.map(route => (
                        <PrivateRoute
                            key={route.path}
                            {...route}
                            component={() => (
                                <MainWrapper>
                                    <route.component />
                                </MainWrapper>
                            )}
                        />
                    ))}

                    <Route component={NotFoundPage} />
                </Switch>
            </Router>
        </ErrorBoundary>
    )
}

export default App
