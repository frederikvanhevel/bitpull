import React, { useEffect } from 'react'
import {
    makeStyles,
    Container,
    Avatar,
    Typography,
    Box
} from '@material-ui/core'
import queryString from 'query-string'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { Redirect, useLocation } from 'react-router'
import Copyright from 'components/ui/Copyright'
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
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

const EmailVerifyingPage: React.FC = () => {
    const classes = useStyles()
    const location = useLocation()
    const dispatch = useDispatch()
    const { token } = queryString.parse(location.search)
    const { user, loading, error } = useSelector<AppState, UserState>(
        state => state.user
    )

    useEffect(() => {
        if (!user?.verified && token) dispatch(verifyEmail(token as string))
    }, [])

    if (user?.verified) return <Redirect to="/" />

    if (loading) return <Loader />

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                {!token ||
                    (error && (
                        <Typography component="h1" variant="h5">
                            Something went wrong. Token may be expired.
                        </Typography>
                    ))}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    )
}

export default EmailVerifyingPage
