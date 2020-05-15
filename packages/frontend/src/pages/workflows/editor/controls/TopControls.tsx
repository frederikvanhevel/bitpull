import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, TextField, Button } from '@material-ui/core'
import Toolbar from 'components/navigation/Toolbar'
import { AppState } from 'redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AddScheduleIcon from 'components/ui/icons/add-schedule-icon'
import { saveCurrentWorkflow, setWorkflowName } from 'actions/workflow'
import { useForm } from 'react-hook-form'
import { Workflow } from 'queries/workflow'

const useStyles = makeStyles((theme: Theme) => ({
    name: {
        width: '200px',
        '& > div': {
            width: '100%'
        },
        '& input': {
            fontSize: '16px'
        }
    },
    buttonWrapper: {
        '& > button, & > a': {
            marginLeft: theme.spacing(2)
        }
    }
}))

const Controls: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const workflow = useSelector<AppState, Workflow>(
        state => state.workflow.currentWorkflow!
    )
    const hasUnsavedChanges = useSelector<AppState, boolean>(
        state => state.workflow.hasUnsavedChanges
    )
    const { register, errors, reset } = useForm({
        defaultValues: {
            name: workflow.name
        },
        mode: 'onChange'
    })

    useEffect(() => {
        if (workflow) reset({ name: workflow.name })
    }, [workflow])

    return (
        <Toolbar>
            <div className={classes.name}>
                <TextField
                    error={!!errors.name}
                    autoFocus
                    placeholder="New workflow"
                    name="name"
                    inputRef={register({ required: true, maxLength: 30 })}
                    inputProps={{
                        maxLength: 30
                    }}
                    onChange={e => dispatch(setWorkflowName(e.target.value))}
                />
            </div>
            <div className={classes.buttonWrapper}>
                {/* {workflow && workflow.id !== 'new' && (
                    <IconButton
                        component={Link}
                        to={`/jobs/new?workflow=${workflow.id}`}
                    >
                        <AddScheduleIcon />
                    </IconButton>
                )} */}

                {workflow && workflow.id !== 'new' && (
                    <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/jobs/new?workflow=${workflow.id}`}
                        startIcon={<AddScheduleIcon />}
                    >
                        Schedule job
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => dispatch(saveCurrentWorkflow())}
                    disabled={
                        Object.values(errors).length > 0 || !hasUnsavedChanges
                    }
                >
                    Save
                </Button>
            </div>
        </Toolbar>
    )
}

export default Controls
