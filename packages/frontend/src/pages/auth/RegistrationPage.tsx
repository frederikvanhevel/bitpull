import React from 'react'
import {
    makeStyles,
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
import { Lock } from '@material-ui/icons'
import Logo from 'components/ui/Logo'
import AuthWrapper from './components/AuthWrapper'
import ContentBox from './components/ContentBox'

const validationSchema = yup.object().shape({
    firstName: yup.string().max(30).required(),
    lastName: yup.string().max(30).required(),
    email: yup.string().email().required()
})

const useStyles = makeStyles(theme => ({
    tagline: {
        lineHeight: 1.8,
        fontSize: 26,
        color: theme.palette.common.white,
        paddingRight: 100,
        [theme.breakpoints.down('sm')]: {
            fontSize: 20,
            textAlign: 'center',
            paddingRight: 0
        }
    },
    paper: {
        paddingTop: '30%',
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    logoWrapper: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
    logo: {
        marginBottom: theme.spacing(2),
        paddingTop: '20%',
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
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
        borderTop: `5px solid ${theme.palette.grey[700]}`
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
        '& a': {
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
    },
    login: {
        textAlign: 'center',
        width: '100%'
    }
}))

const RegistrationPage: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const { ref, email } = queryString.parse(location.search)
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
                referralId: ref as string
            })
        )
    }

    if (user) return <Redirect to="/" />

    return (
        <AuthWrapper size="lg">
            <PageTitle>Sign up - BitPull</PageTitle>

            <Grid container spacing={2}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={7}
                    className={classes.logoWrapper}
                >
                    <Logo className={classes.logo} />

                    <Typography variant="h5" className={classes.tagline}>
                        The <strong>data platform</strong> that lets you scrape
                        website data without a hassle.{' '}
                        <strong>No coding</strong> knowledge required.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <ContentBox showLogo={false}>
                        <Paper className={classes.content} elevation={2}>
                            <div className={classes.top}>
                                <Typography component="h1" variant="h5">
                                    Sign up for free
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
                                    size="large"
                                    loading={loading}
                                    disabled={
                                        loading ||
                                        Object.keys(errors).length !== 0
                                    }
                                >
                                    Create my account
                                </LoadingButton>

                                <Typography
                                    variant="caption"
                                    className={classes.terms}
                                >
                                    By creating an account, you agree to the{' '}
                                    <Link
                                        href="https://bitpull.io/tos"
                                        target="_blank"
                                    >
                                        Terms of Service
                                    </Link>
                                    .
                                </Typography>
                            </form>
                        </Paper>

                        <Grid container classes={{ root: classes.footer }}>
                            <GoogleSignIn
                                label="Sign up with Google"
                                size="large"
                                referralId={ref as string}
                                className={classes.google}
                            />

                            <Grid item className={classes.login}>
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    variant="body2"
                                >
                                    Already have an account?{' '}
                                    <strong>Sign in</strong>
                                </Link>
                            </Grid>
                        </Grid>
                    </ContentBox>
                </Grid>
            </Grid>
        </AuthWrapper>
    )
}

export default RegistrationPage
