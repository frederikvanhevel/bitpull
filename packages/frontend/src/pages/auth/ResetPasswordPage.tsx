import React, { useEffect } from 'react'
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
import { useSnackbar } from 'notistack'
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { RESET_PASSWORD } from 'mutations/user'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { useForm } from 'react-hook-form'
import {
    resetPassword,
    resetPasswordVariables
} from 'mutations/user/typedefs/resetPassword'
import { getError } from 'utils/errors'
import AuthWrapper from './components/AuthWrapper'
import PageTitle from 'components/navigation/PageTitle'
import ContentBox from './components/ContentBox'
import { Lock } from '@material-ui/icons'

type PasswordResetForm = {
    password: string
    passwordRepeat: string
}

const useStyles = makeStyles(theme => ({
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
        borderTop: `5px solid ${theme.palette.grey[700]}`,
        width: '100%'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

const ResetPasswordPage: React.FC = () => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const history = useHistory()
    const location = useLocation()
    const { token } = queryString.parse(location.search)
    const { handleSubmit, register, errors } = useForm<PasswordResetForm>()
    const [doRequest, { data, loading, error }] = useMutation<
        resetPassword,
        resetPasswordVariables
    >(RESET_PASSWORD)

    const onSubmit = (props: PasswordResetForm) => {
        if (props.password !== props.passwordRepeat) return

        doRequest({
            variables: {
                token: token as string,
                password: props.password
            }
        })
    }

    useEffect(() => {
        if (data?.resetPassword === true) {
            enqueueSnackbar(
                'Your password has been reset. You can now log in.',
                {
                    variant: 'success'
                }
            )
            history.push('/login')
        }
    }, [data])

    return (
        <AuthWrapper>
            <PageTitle>Reset password - BitPull</PageTitle>

            <ContentBox>
                <Paper className={classes.content} elevation={2}>
                    <div className={classes.top}>
                        <Typography component="h1" variant="h5">
                            Reset password
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
                            name="password"
                            label="New password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            error={!!errors.password}
                            inputRef={register({
                                required: 'Required'
                            })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="passwordRepeat"
                            label="Repeat your new password"
                            type="password"
                            id="passwordRepeat"
                            autoComplete="new-password"
                            error={!!errors.passwordRepeat}
                            inputRef={register({
                                required: 'Required'
                            })}
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
                            Change password
                        </LoadingButton>

                        <Grid container>
                            <Grid item>
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    variant="body2"
                                >
                                    Don't have an account?{' '}
                                    <strong>Sign Up</strong>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </ContentBox>
        </AuthWrapper>
    )
}

export default ResetPasswordPage
