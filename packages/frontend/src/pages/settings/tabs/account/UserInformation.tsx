import React, { useState } from 'react'
import { Grid, TextField, Button, makeStyles, Theme } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { useForm } from 'react-hook-form'
import { pickAll } from 'ramda'
import { UpdateUserInput } from 'typedefs/graphql'
import { updateInformation } from 'actions/user'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { UserState } from 'reducers/user'
import ConfirmCancelDialog from './ConfirmCancelDialog'

const useStyles = makeStyles((theme: Theme) => ({
    actions: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    divider: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    },
    cancel: {
        color: theme.palette.error.light
    }
}))

const UserInfo: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { user, loading } = useSelector<AppState, UserState>(
        state => state.user
    )
    const { handleSubmit, register, errors, formState } = useForm<
        UpdateUserInput
    >({
        defaultValues: user
    })
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

    const onSubmit = (data: UpdateUserInput) => {
        const toUpdate: UpdateUserInput = pickAll(
            Array.from(formState.dirtyFields),
            data
        )
        dispatch(updateInformation(toUpdate))
    }

    return (
        <Grid item xs={6} md={6} lg={5} xl={4}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        id="firstName"
                        label="First Name"
                        fullWidth
                        error={!!errors.firstName}
                        inputRef={register({
                            required: 'Required'
                        })}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lname"
                        fullWidth
                        error={!!errors.lastName}
                        inputRef={register({
                            required: 'Required'
                        })}
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
                        inputRef={register({
                            required: 'Required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'invalid email address'
                            }
                        })}
                    />
                </Grid>
            </Grid>

            <br />

            <div className={classes.actions}>
                <LoadingButton
                    color="primary"
                    variant="contained"
                    disabled={!errors || !formState.dirty || loading}
                    loading={loading}
                    onClick={handleSubmit(onSubmit)}
                >
                    Save
                </LoadingButton>

                <Button
                    size="small"
                    className={classes.cancel}
                    onClick={() => setCancelDialogOpen(true)}
                >
                    Cancel account
                </Button>
            </div>

            <ConfirmCancelDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
            />
        </Grid>
    )
}

export default UserInfo
