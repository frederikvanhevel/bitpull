import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Dialog } from '@material-ui/core'
import Settings from './Settings'
import Runner from './Runner'
import { AppState } from 'redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setWatchedNodeResult } from 'actions/workflow'
import LogView from 'components/logs/LogView'
import JsonView from 'components/logs/JsonView'
import { runNode, cancelRunNode } from 'actions/runner'
import { WorkflowState } from 'reducers/workflow'
import Segment, { TrackingEvent } from 'services/segment'

const useStyles = makeStyles((theme: Theme) => ({
    controls: {
        position: 'absolute',
        bottom: theme.spacing(3),
        right: theme.spacing(3)
    },
    dialog: {
        background: 'rgba(38, 38, 38)'
    }
}))

const BottomControls: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { running, result, watchedNodeResult } = useSelector<
        AppState,
        WorkflowState
    >(state => state.workflow)
    const [showLogs, setShowLogs] = useState(false)
    const closeLogDialog = () => setShowLogs(false)
    const runWorkflow = () => dispatch(runNode())
    const cancelWorkflow = () => dispatch(cancelRunNode())
    const closeWatchResult = () => dispatch(setWatchedNodeResult(undefined))

    return (
        <div className={classes.controls}>
            <Settings
                running={running}
                onShowLogs={() => {
                    setShowLogs(true)
                    Segment.track(TrackingEvent.WORKFLOW_VIEW_LOGS)
                }}
            />

            <Runner
                run={runWorkflow}
                running={running}
                cancel={cancelWorkflow}
            />

            {showLogs && result && (
                <Dialog
                    open={true}
                    onClose={closeLogDialog}
                    classes={{ paper: classes.dialog }}
                >
                    <LogView logs={result.logs} onClose={closeLogDialog} />
                </Dialog>
            )}

            {watchedNodeResult && (
                <Dialog
                    open={true}
                    onClose={closeWatchResult}
                    maxWidth="md"
                    fullWidth
                >
                    <JsonView
                        data={watchedNodeResult}
                        onClose={closeWatchResult}
                    />
                </Dialog>
            )}
        </div>
    )
}

export default BottomControls
