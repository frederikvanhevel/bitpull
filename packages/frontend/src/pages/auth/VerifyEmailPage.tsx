import React from 'react'
import {
    makeStyles,
    Container,
    Avatar,
    Typography,
    Box,
    Button,
    Link,
    Grid
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { Redirect } from 'react-router'
import Copyright from 'components/ui/Copyright'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { useMutation } from '@apollo/react-hooks'
import { SEND_VERIFICATION_EMAIL } from 'mutations/user'
import { UserState } from 'reducers/user'
import debounce from 'lodash.debounce'
import { logout } from 'actions/user'

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
    },
    footer: {
        marginTop: theme.spacing(3)
    }
}))

const VerifyEmailPage: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { user } = useSelector<AppState, UserState>(state => state.user)
    const [sendMail] = useMutation(SEND_VERIFICATION_EMAIL)
    const debouncedSend = debounce(sendMail, 5000, {
        leading: true,
        trailing: false
    })

    if (!user) return <Redirect to="/login" />
    else if (user.verified) return <Redirect to="/" />

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Verify your email
                </Typography>

                <br />

                <Typography component="h3" variant="subtitle1">
                    We've sent you an email with instructions to verify your
                    email address. Please open it and click the link.
                </Typography>

                <br />

                <Button onClick={() => debouncedSend()} color="primary">
                    Resend email
                </Button>

                <Grid container classes={{ root: classes.footer }}>
                    <Grid item xs />
                    <Grid item>
                        <Link
                            onClick={() => dispatch(logout())}
                            variant="body2"
                        >
                            {'Back to login'}
                        </Link>
                    </Grid>
                </Grid>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    )
}

export default VerifyEmailPage
