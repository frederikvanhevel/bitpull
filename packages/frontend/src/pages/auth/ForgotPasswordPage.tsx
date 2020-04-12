import React from 'react'
import {
    makeStyles,
    Typography,
    Grid,
    TextField,
    Link,
    Paper
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FORGOT_PASSWORD } from 'mutations/user'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import {
    forgotPassword,
    forgotPasswordVariables
} from 'mutations/user/typedefs/forgotPassword'
import { useForm } from 'react-hook-form'
import PageTitle from 'components/navigation/PageTitle'
import AuthWrapper from './components/AuthWrapper'
import ContentBox from './components/ContentBox'
import { Lock } from '@material-ui/icons'

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
        margin: theme.spacing(3, 0, 2),
        marginBottom: 0
    },
    footer: {
        padding: theme.spacing(4)
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
        <AuthWrapper>
            <PageTitle>Forgot password - BitPull</PageTitle>

            <ContentBox>
                <Paper className={classes.content} elevation={2}>
                    <div className={classes.top}>
                        <Typography component="h1" variant="h5">
                            Forgot password
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
                        />

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
                            {data && data.forgotPassword
                                ? 'Instructions sent!'
                                : 'Send reset instructions'}
                        </LoadingButton>
                    </form>
                </Paper>

                <Grid container classes={{ root: classes.footer }}>
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
            </ContentBox>
        </AuthWrapper>
    )
}

export default ForgotPasswordPage
