import React from 'react'
import ListItemLink from './ListItemLink'
import {
    Dashboard,
    Assignment,
    Layers,
    BarChart,
    Settings,
    Redeem,
    HelpOutline
} from '@material-ui/icons'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { List, Chip, makeStyles, Theme } from '@material-ui/core'
import StorageIcon from 'components/ui/icons/storage-icon'
import { AppState } from 'redux/store'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme: Theme) => ({
    chipWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chip: {
        backgroundColor: theme.palette.tertiary.main,
        color: theme.palette.tertiary.contrastText
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: theme.spacing(2)
    }
}))

export const MainListItems: React.FC = () => {
    const classes = useStyles()
    const newItems = useSelector<AppState, number>(
        state => state.storage.newItems
    )

    return (
        <List component="nav">
            <ListItemLink
                exact
                to="/"
                primary="Dashboard"
                icon={<BarChart />}
            />
            <ListItemLink
                exact
                to="/workflows"
                primary="Workflows"
                icon={<Assignment />}
            />
            <ListItemLink
                exact
                to="/jobs"
                primary="Jobs"
                icon={<ScheduleIcon />}
            />
            <ListItemLink
                exact
                to="/storage"
                primary={
                    newItems > 0 ? (
                        <div className={classes.chipWrapper}>
                            Storage{' '}
                            <Chip
                                label={newItems}
                                classes={{ root: classes.chip }}
                            />
                        </div>
                    ) : (
                        'Storage'
                    )
                }
                icon={<StorageIcon />}
            />
            <ListItemLink
                exact
                to="/integrations"
                primary="Integrations"
                icon={<Layers />}
            />
            <ListItemLink
                exact
                to="/templates"
                primary="Templates"
                icon={<Dashboard />}
            />
        </List>
    )
}

export const SecondaryListItems: React.FC = () => (
    <List component="nav">
        <ListItemLink
            exact
            to="/settings"
            primary="Settings"
            icon={<Settings />}
        />
        <ListItemLink
            exact
            to="/referral"
            primary="Earn bonus time"
            icon={<Redeem />}
        />
    </List>
)

export const BottomListItems: React.FC = () => {
    const classes = useStyles()

    return (
        <List component="nav" className={classes.bottom}>
            <ListItemLink
                exact
                to="/help"
                primary="Feedback"
                icon={<HelpOutline />}
            />
        </List>
    )
}
