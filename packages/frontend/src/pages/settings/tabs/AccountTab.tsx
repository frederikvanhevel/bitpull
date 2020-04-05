import React from 'react'
import {
    Grid,
    Typography,
    makeStyles,
    Theme,
    Divider,
    Paper
} from '@material-ui/core'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import NotificationSettings from './account/NotificationSettings'
import UserInformation from './account/UserInformation'

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

const AccountTab: React.FC = () => {
    const classes = useStyles()

    return (
        <PaddingWrapper>
            <Paper>
                <PaddingWrapper>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Your Account</Typography>
                        </Grid>

                        <UserInformation />
                    </Grid>

                    <Divider className={classes.divider} />

                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Notifications</Typography>
                        </Grid>

                        <NotificationSettings />
                    </Grid>
                </PaddingWrapper>
            </Paper>
        </PaddingWrapper>
    )
}

export default AccountTab
