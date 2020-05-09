import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import queryString from 'query-string'
import { useSnackbar } from 'notistack'
import Toolbar from 'components/navigation/Toolbar'
import {
    Button,
    Paper,
    makeStyles,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    FormControl,
    InputLabel,
    TextField
} from '@material-ui/core'
import { Link, useHistory, useLocation } from 'react-router-dom'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import TimeSelect, { ScheduleType, Time } from './TimeSelect'
import WorkflowSelect from './WorkflowSelect'
import { useMutation } from '@apollo/react-hooks'
import { createJob, createJobVariables } from 'mutations/job/typedefs/createJob'
import { CREATE_JOB } from 'mutations/job'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { getError } from 'utils/errors'
import PageTitle from 'components/navigation/PageTitle'

const useStyles = makeStyles(theme => ({
    select: {
        width: 322
    },
    actions: {
        marginTop: theme.spacing(2),
        '& > div': {
            minWidth: 322
        },
        '& > button, & > a': {
            marginLeft: theme.spacing(2)
        }
    },
    hidden: {
        display: 'none'
    }
}))

const defaultTime: Time = {
    type: ScheduleType.INTERVAL,
    value: '30 minutes'
}

const CreateJobPage: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const query = queryString.parse(location.search)
    const { enqueueSnackbar } = useSnackbar()
    const [workflow, setWorkflow] = useState(query.workflow as string)
    const [time, setTime] = useState<Time>(defaultTime)
    const [name, setName] = useState<string>('')
    const [saveJob, { data, loading, error }] = useMutation<
        createJob,
        createJobVariables
    >(CREATE_JOB, {
        variables: {
            input: {
                name,
                workflowId: workflow,
                type: time.type,
                schedule: time.value
            }
        }
    })

    useEffect(() => {
        if (data && data.createJob.id) history.push('/jobs')
    }, [data])

    useEffect(() => {
        if (error)
            enqueueSnackbar(getError(error), {
                variant: 'error'
            })
    }, [error])

    return (
        <>
            <PageTitle>Schedule job - BitPull</PageTitle>

            <Toolbar>
                <Typography variant="body2">
                    Schedule a new job. Choose between interval, cron or run the
                    job only once.
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/jobs"
                >
                    Back to overview
                </Button>
            </Toolbar>

            <PaddingWrapper withTopbar>
                <Paper>
                    <Stepper orientation="vertical">
                        <Step active={true}>
                            <StepLabel>Choose a workflow</StepLabel>
                            <StepContent>
                                <FormControl className={classes.select}>
                                    <InputLabel
                                        shrink={!!workflow}
                                        className={cx({
                                            [classes.hidden]: !!workflow
                                        })}
                                    >
                                        Select a workflow
                                    </InputLabel>
                                    <WorkflowSelect
                                        selectedWorkflow={workflow}
                                        onChange={setWorkflow}
                                    />
                                </FormControl>
                            </StepContent>
                        </Step>

                        <Step active={true}>
                            <StepLabel>Set your job schedule</StepLabel>
                            <StepContent>
                                <TimeSelect time={time} onChange={setTime} />
                            </StepContent>
                        </Step>

                        <Step active={true}>
                            <StepLabel>Name & save your job</StepLabel>
                            <StepContent>
                                <div className={classes.actions}>
                                    <TextField
                                        value={name}
                                        placeholder="Your job name ..."
                                        onChange={e => setName(e.target.value)}
                                        error={name.length > 35}
                                        inputProps={{
                                            maxLength: 35
                                        }}
                                    />

                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            !workflow || name === '' || loading
                                        }
                                        onClick={() => saveJob()}
                                        loading={loading}
                                    >
                                        Save
                                    </LoadingButton>
                                    <Button
                                        size="small"
                                        component={Link}
                                        to="/jobs"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    </Stepper>
                </Paper>
            </PaddingWrapper>
        </>
    )
}

export default CreateJobPage
