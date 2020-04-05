import React from 'react'
import {
    makeStyles,
    Container,
    Avatar,
    Typography,
    Grid,
    TextField,
    FormHelperText,
    Box,
    Link
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useMutation } from '@apollo/react-hooks'
import { FORGOT_PASSWORD } from 'mutations/user'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import Copyright from 'components/ui/Copyright'
import {
    forgotPassword,
    forgotPasswordVariables
} from 'mutations/user/typedefs/forgotPassword'
import { useForm } from 'react-hook-form'
import PageTitle from 'components/navigation/PageTitle'

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

const ForgotPasswordPage: React.FC = () => {
    const classes = useStyles()
    const { handleSubmit, register, errors } = useForm<
        forgotPasswordVariables
    >()
    const [doRequest, { data, loading }] = useMutation<
        forgotPassword,
        forgotPasswordVariables
    >(FORGOT_PASSWORD)

    const onSubmit = (props: forgotPasswordVariables) => {
        doRequest({
            variables: props
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <PageTitle>Forgot password - BitPull</PageTitle>

            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot password
                </Typography>

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
                    />
                    {data && data.forgotPassword && (
                        <FormHelperText>Instructions sent!</FormHelperText>
                    )}
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                        loading={loading}
                        disabled={
                            loading ||
                            Object.keys(errors).length !== 0 ||
                            (data && data.forgotPassword === true)
                        }
                    >
                        Send reset instructions
                    </LoadingButton>
                    <Grid container>
                        <Grid item>
                            <Link
                                component={RouterLink}
                                to="/register"
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    )
}

export default ForgotPasswordPage
