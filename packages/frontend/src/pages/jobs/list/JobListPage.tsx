import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { getJobs } from 'queries/job/typedefs/getJobs'
import { GET_JOBS, Job } from 'queries/job'
import Toolbar from 'components/navigation/Toolbar'
import {
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    makeStyles
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import Loader from 'components/ui/Loader'
import ReadableTime from 'components/ui/ReadableTime'
import StatusList from './StatusList'
import LogViewDialog from 'components/logs/LogViewDialog'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import OptionsMenu from './OptionsMenu'
import { removeJob } from 'mutations/job/typedefs/removeJob'
import { REMOVE_JOB } from 'mutations/job'
import PaymentWarning from './PaymentWarning'
import ErrorScreen from 'components/ui/ErrorScreen'
import { formatDistanceStrict } from 'date-fns'
import PageTitle from 'components/navigation/PageTitle'

const useStyles = makeStyles(theme => ({
    table: {
        transition: 'opacity .2s ease',
        '& td': {
            fontSize: '0.8125rem'
        }
    },
    loading: {
        opacity: '.5'
    },
    empty: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    topBarButtons: {
        display: 'flex'
    }
}))

const JobListPage: React.FC = () => {
    const classes = useStyles()
    const [jobToDelete, setJobToDelete] = useState<string>()
    const [shownLog, setShownLog] = useState<string>()
    const { data, loading, error, stopPolling } = useQuery<getJobs>(GET_JOBS, {
        fetchPolicy: 'cache-and-network',
        pollInterval: 1000
    })
    const [remove] = useMutation<removeJob>(REMOVE_JOB, {
        variables: { id: jobToDelete },
        refetchQueries: [
            {
                query: GET_JOBS
            }
        ]
    })
    const jobs = data ? data.getJobs : []

    const getJobDuration = (job: Job) => {
        if (job.status.running) {
            return formatDistanceStrict(new Date(), new Date(job.lastRun))
        } else if (job.lastFinished) {
            return formatDistanceStrict(
                new Date(job.lastFinished),
                new Date(job.lastRun)
            )
        }

        return null
    }

    // useEffect(() => {
    //     if (error) stopPolling()
    // }, [error])

    // if (error) return <ErrorScreen />
    if (!data && loading) return <Loader />

    return (
        <>
            <PageTitle>Jobs - BitPull</PageTitle>

            <Toolbar>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component={Link}
                    to="/jobs/new"
                >
                    Schedule new job
                </Button>
            </Toolbar>

            {jobs.length > 0 && <PaymentWarning />}

            <PaddingWrapper withTopbar>
                <Paper>
                    <Table
                        className={classnames(classes.table, {
                            [classes.loading]: !data && loading
                        })}
                        size="small"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell size="medium">Status</TableCell>
                                <TableCell align="right">Job name</TableCell>
                                <TableCell align="right">Workflow</TableCell>
                                <TableCell align="right">
                                    Last run started
                                </TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">
                                    Next run starts
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!jobs.length ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography
                                            className={classes.empty}
                                            variant="body2"
                                        >
                                            You don&lsquo;t have any jobs
                                            scheduled yet.{' '}
                                            <Link to="/jobs/new">
                                                Schedule a new job
                                            </Link>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : null}

                            {jobs.map(job => (
                                <TableRow key={job.id}>
                                    <TableCell component="th" scope="row">
                                        <StatusList
                                            job={job}
                                            onClick={setShownLog}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {job.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link
                                            to={`/workflow/${job.workflowId}`}
                                        >
                                            {job.workflowName}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">
                                        {job.lastRun && (
                                            <ReadableTime
                                                time={new Date(job.lastRun)}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {getJobDuration(job)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {!job.status.paused && job.nextRun && (
                                            <ReadableTime
                                                time={new Date(job.nextRun)}
                                                future
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <OptionsMenu
                                            job={job}
                                            showLog={setShownLog}
                                            removeJob={setJobToDelete}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {shownLog && (
                    <LogViewDialog
                        jobId={shownLog}
                        onClose={() => setShownLog(undefined)}
                    />
                )}

                <ConfirmDialog
                    title="Are you sure?"
                    onClose={() => setJobToDelete(undefined)}
                    onConfirm={() => {
                        setJobToDelete(undefined)
                        remove()
                    }}
                    open={!!jobToDelete}
                >
                    You cannot undo this action
                </ConfirmDialog>
            </PaddingWrapper>
        </>
    )
}

export default JobListPage
