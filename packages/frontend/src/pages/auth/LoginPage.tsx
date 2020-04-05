import React from 'react'
import {
    makeStyles,
    Container,
    Typography,
    Grid,
    TextField,
    Link,
    FormHelperText,
    Paper
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { Redirect, useLocation } from 'react-router'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { useForm } from 'react-hook-form'
import { LoginUserInput } from 'typedefs/graphql'
import { login } from 'actions/user'
import { UserState } from 'reducers/user'
import GoogleSignIn from 'components/ui/buttons/GoogleSignIn'
import { getError } from 'utils/errors'
import PageTitle from 'components/navigation/PageTitle'
import { RouterState } from 'components/navigation/PrivateRoute'
import logo from './images/logo.png'
import { Lock } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 440,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    logo: {
        width: 200,
        marginBottom: theme.spacing(2)
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
        padding: theme.spacing(4),
        background: theme.palette.grey[100]
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(3, 0, 3),
        marginBottom: theme.spacing(1)
    },
    text: {
        background: theme.palette.common.white
    },
    footer: {
        padding: theme.spacing(4)
    },
    google: {
        marginBottom: theme.spacing(4)
    }
}))

const LoginPage: React.FC = () => {
    const classes = useStyles()
    const { state: routerState } = useLocation<RouterState | undefined>()
    const { handleSubmit, register, errors } = useForm<LoginUserInput>()
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector<AppState, UserState>(
        state => state.user
    )

    const onSubmit = (data: LoginUserInput) => {
        dispatch(login(data))
    }

    if (user) return <Redirect to={routerState?.from || '/'} />

    return (
        <Container component="main" maxWidth="sm" fixed>
            <PageTitle>Login - BitPull</PageTitle>

            <div className={classes.paper}>
                <img src={logo} className={classes.logo} />

                <Paper className={classes.content} elevation={0}>
                    <div className={classes.top}>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Lock />
                    </div>

                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            inputRef={register({
                                required: 'Required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'invalid email address'
                                }
                            })}
                            className={classes.text}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            inputRef={register({
                                required: 'Required'
                            })}
                            className={classes.text}
                        />

                        {error && (
                            <FormHelperText error>
                                {getError(error)}
                            </FormHelperText>
                        )}

                        <LoadingButton
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            type="submit"
                            loading={loading}
                            disabled={
                                loading || Object.keys(errors).length !== 0
                            }
                        >
                            Sign In
                        </LoadingButton>
                    </form>
                </Paper>

                <Grid container classes={{ root: classes.footer }}>
                    <GoogleSignIn
                        label="Sign in with Google"
                        className={classes.google}
                    />

                    <Grid item xs>
                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            variant="body2"
                        >
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link
                            component={RouterLink}
                            to="/register"
                            variant="body2"
                        >
                            Don't have an account? <strong>Sign Up</strong>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}

export default LoginPage
