import React from 'react'
import {
    makeStyles,
    Container,
    Typography,
    Grid,
    TextField,
    FormHelperText,
    Link,
    Paper
} from '@material-ui/core'
import queryString from 'query-string'
import { Link as RouterLink } from 'react-router-dom'
import { Redirect, useLocation } from 'react-router'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { useForm } from 'react-hook-form'
import { RegisterUserInput } from 'typedefs/graphql'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { register as registerUser } from 'actions/user'
import { UserState } from 'reducers/user'
import * as yup from 'yup'
import GoogleSignIn from 'components/ui/buttons/GoogleSignIn'
import { getError } from 'utils/errors'
import PageTitle from 'components/navigation/PageTitle'
import logo from './images/logo.png'
import { Lock } from '@material-ui/icons'

const validationSchema = yup.object().shape({
    firstName: yup.string().max(30).required(),
    lastName: yup.string().max(30).required(),
    email: yup.string().email().required()
})

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.primary.dark
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
        padding: theme.spacing(4),
        color: theme.palette.common.white,
        '& a': {
            color: theme.palette.common.white,
            marginTop: theme.spacing(2)
        }
    },
    google: {
        marginBottom: theme.spacing(3)
    },
    terms: {
        marginBottom: theme.spacing(2),
        '& > a': {
            textDecoration: 'underline'
        }
    }
}))

const RegistrationPage: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const { grsf, email } = queryString.parse(location.search)
    const { handleSubmit, register, errors } = useForm<RegisterUserInput>({
        validationSchema
    })
    const { user, loading, error } = useSelector<AppState, UserState>(
        state => state.user
    )

    const onSubmit = (data: RegisterUserInput) => {
        dispatch(
            registerUser({
                ...data,
                referralId: grsf as string
            })
        )
    }

    if (user) return <Redirect to="/" />

    return (
        <Container component="main" maxWidth="sm" fixed>
            <PageTitle>Sign up - BitPull</PageTitle>

            <div className={classes.paper}>
                <img src={logo} className={classes.logo} />

                <Paper className={classes.content} elevation={0}>
                    <div className={classes.top}>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Lock />
                    </div>

                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    error={!!errors.firstName}
                                    inputRef={register()}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    error={!!errors.lastName}
                                    inputRef={register()}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!errors.email}
                                    inputRef={register()}
                                    defaultValue={email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
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
                                />
                            </Grid>
                        </Grid>

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
                            Sign Up
                        </LoadingButton>
                    </form>
                </Paper>

                <Grid container classes={{ root: classes.footer }}>
                    <GoogleSignIn
                        label="Sign up with Google"
                        referralId={grsf as string}
                        className={classes.google}
                    />

                    <Typography variant="caption" className={classes.terms}>
                        By creating an account, you agree to the{' '}
                        <Link href="https://bitpull.io/tos" target="_blank">
                            Terms of Service
                        </Link>
                        .
                    </Typography>

                    <Grid item>
                        <Link
                            component={RouterLink}
                            to="/login"
                            variant="body2"
                        >
                            Already have an account? <strong>Sign in</strong>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}

export default RegistrationPage
