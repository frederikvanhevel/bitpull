import React, { useEffect } from 'react'
import { makeStyles, Container, Typography } from '@material-ui/core'
import queryString from 'query-string'
import { Redirect, useLocation, useHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import Loader from 'components/ui/Loader'
import { verifyEmail } from 'actions/user'
import { UserState } from 'reducers/user'

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    error: {
        color: theme.palette.error.main
    }
}))

const EmailVerifyingPage: React.FC = () => {
    const classes = useStyles()
    const location = useLocation()
    const history = useHistory()
    const dispatch = useDispatch()
    const { token } = queryString.parse(location.search)
    const { user, loading, error } = useSelector<AppState, UserState>(
        state => state.user
    )

    useEffect(() => {
        if (!user?.verified && token) dispatch(verifyEmail(token as string))
    }, [])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                history.push('/login')
            }, 4000)
        }
    }, [error])

    if (user?.verified) return <Redirect to="/" />

    if (loading) return <Loader />

    return (
        <Container component="main" maxWidth="sm">
            <div className={classes.paper}>
                {!token ||
                    (error && (
                        <>
                            <Typography
                                component="h1"
                                variant="h5"
                                className={classes.error}
                            >
                                Your verification token is invalid or expired.
                            </Typography>

                            <br />
                            <br />

                            <Loader text="Redirecting you to login" />
                        </>
                    ))}
            </div>
        </Container>
    )
}

export default EmailVerifyingPage
