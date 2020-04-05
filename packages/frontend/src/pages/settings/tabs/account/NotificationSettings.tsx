import React from 'react'
import { Grid, Switch, FormControlLabel } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { updateSettings } from 'actions/settings'
import { UserSettings } from 'queries/user/typedefs'

const NotificationSettings: React.FC = () => {
    const settings = useSelector<AppState, UserSettings>(
        state => state.settings
    )
    const dispatch = useDispatch()

    return (
        <Grid item xs={6} md={6} lg={5} xl={4}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings?.failedJobEmail}
                                onChange={() =>
                                    dispatch(
                                        updateSettings(
                                            {
                                                failedJobEmail: !settings!
                                                    .failedJobEmail
                                            },
                                            settings
                                        )
                                    )
                                }
                                color="primary"
                            />
                        }
                        label="Notify me by email when a job fails"
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NotificationSettings
