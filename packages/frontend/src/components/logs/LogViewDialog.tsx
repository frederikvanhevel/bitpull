import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Loader from 'components/ui/Loader'
import { useQuery } from '@apollo/react-hooks'
import { getJobLogs } from 'queries/job/typedefs/getJobLogs'
import { GET_JOB_LOGS } from 'queries/job'
import LogView from './LogView'
import { ParseLog } from '@bitpull/worker/lib/typedefs'
import { makeStyles } from '@material-ui/core'

interface Props {
    jobId: string
    onClose: () => void
}

const useStyles = makeStyles(() => ({
    wrapper: {
        background: 'rgba(38, 38, 38)'
    }
}))

const LogViewDialog: React.FC<Props> = ({ jobId, onClose }) => {
    const classes = useStyles()
    const { data, loading } = useQuery<getJobLogs>(GET_JOB_LOGS, {
        variables: {
            id: jobId
        },
        fetchPolicy: 'cache-and-network'
    })
    const logs = data?.getJobLogs?.logs || []

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            classes={{ paper: classes.wrapper }}
        >
            {!loading ? (
                <LogView logs={logs as ParseLog[]} onClose={onClose} />
            ) : (
                <Loader hideText />
            )}
        </Dialog>
    )
}

export default LogViewDialog
