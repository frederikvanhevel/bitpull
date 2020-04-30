import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, IconButton, Menu, MenuItem } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import SettingsIcon from '@material-ui/icons/Settings'
import DescriptionIcon from '@material-ui/icons/Description'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { setWatchedNodeId, toggleWatcherSelect } from 'actions/workflow'
import { WorkflowState } from 'reducers/workflow'

interface Props {
    running: boolean
    onShowLogs: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
}))

const Settings: React.FC<Props> = ({ running, onShowLogs }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState<EventTarget & Element>()
    const workflow = useSelector<AppState, WorkflowState>(
        state => state.workflow
    )
    const { result, isSelectingWatcher, watchedNodeId } = workflow

    const toggleWatcherSelection = () => {
        dispatch(
            watchedNodeId ? setWatchedNodeId(undefined) : toggleWatcherSelect()
        )
    }
    const closeMenu = (e: any, cb: Function) => {
        setAnchorEl(undefined)
        cb()
    }
    // const changeSettings = (newSettings: object) => {
    //     dispatch(changeWorkflowSettings(newSettings))
    // }

    return (
        <>
            <IconButton
                onClick={e => setAnchorEl(e.currentTarget)}
                disabled={running}
            >
                <SettingsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(undefined)}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                {/* <MenuItem>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentWorkflow?.settings.useProxy}
                                onChange={(e, checked) =>
                                    changeSettings({ useProxy: checked })
                                }
                            />
                        }
                        label="Anonymize"
                    />
                </MenuItem>
                <Divider /> */}
                <MenuItem
                    onClick={e => closeMenu(e, onShowLogs)}
                    disabled={!result}
                >
                    <DescriptionIcon className={classes.extendedIcon} /> View
                    logs
                </MenuItem>
                <MenuItem onClick={e => closeMenu(e, toggleWatcherSelection)}>
                    {watchedNodeId || isSelectingWatcher ? (
                        <VisibilityOffIcon className={classes.extendedIcon} />
                    ) : (
                        <VisibilityIcon className={classes.extendedIcon} />
                    )}{' '}
                    {watchedNodeId || isSelectingWatcher
                        ? 'Remove preview'
                        : 'Preview data'}
                </MenuItem>
            </Menu>
        </>
    )
}

export default Settings
