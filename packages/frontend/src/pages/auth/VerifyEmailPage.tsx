import React from 'react'
import {
    makeStyles,
    Typography,
    Button,
    Link,
    Grid,
    Paper
} from '@material-ui/core'
import { Redirect } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { useMutation } from '@apollo/react-hooks'
import { SEND_VERIFICATION_EMAIL } from 'mutations/user'
import { UserState } from 'reducers/user'
import debounce from 'lodash.debounce'
import { logout } from 'actions/user'
import AuthWrapper from './components/AuthWrapper'
import ContentBox from './components/ContentBox'
import { Email } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    top: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& svg': {
            fill: theme.palette.grey[400],
            wdith: 20,
            height: 20
        }
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(4),
        borderTop: `5px solid ${theme.palette.grey[700]}`
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
        <AuthWrapper>
            <ContentBox>
                <Paper className={classes.content} elevation={2}>
                    <div className={classes.top}>
                        <Typography component="h1" variant="h5">
                            Verify your email
                        </Typography>
                        <Email />
                    </div>

                    <br />

                    <Typography component="h3" variant="subtitle1">
                        We've sent you an email with instructions to verify your
                        email address. Please open it and click the link.
                    </Typography>

                    <br />

                    <Button onClick={() => debouncedSend()} color="primary">
                        Resend email
                    </Button>
                </Paper>

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
            </ContentBox>
        </AuthWrapper>
    )
}

export default VerifyEmailPage
