import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import DescriptionIcon from '@material-ui/icons/Description'
import MoreMenu from 'components/ui/MoreMenu'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { resumeJob } from 'mutations/job/typedefs/resumeJob'
import { RESUME_JOB, PAUSE_JOB } from 'mutations/job'
import { pauseJob } from 'mutations/job/typedefs/pauseJob'
import { GET_JOBS, Job } from 'queries/job'
import { HAS_PAYMENT_METHOD } from 'queries/payment'
import { hasPaymentMethod } from 'queries/user/typedefs/hasPaymentMethod'

interface Props {
    job: Job
    showLog: (jobId: string) => void
    removeJob: (jobId: string) => void
}

const OptionsMenu: React.FC<Props> = ({ job, showLog, removeJob }) => {
    const { data } = useQuery<hasPaymentMethod>(HAS_PAYMENT_METHOD)
    const paymentReady = data && data.hasPaymentMethod === true
    const [resume] = useMutation<resumeJob>(RESUME_JOB, {
        variables: { id: job.id },
        refetchQueries: [
            {
                query: GET_JOBS
            }
        ]
    })
    const [pause] = useMutation<pauseJob>(PAUSE_JOB, {
        variables: { id: job.id },
        refetchQueries: [
            {
                query: GET_JOBS
            }
        ]
    })

    const isPaused = job.status.paused === true
    const items = job.status.repeating
        ? [
              {
                  label: isPaused ? 'Resume job' : 'Pause job',
                  icon: isPaused ? <PlayArrowIcon /> : <PauseIcon />,
                  disabled: !paymentReady,
                  onClick: () => (isPaused ? resume() : pause())
              }
          ]
        : []

    const menuOptions = [
        {
            label: 'View log',
            icon: <DescriptionIcon />,
            disabled: !job.lastFinished && !job.status.failed,
            onClick: () => showLog(job.id)
        },
        ...items,
        {
            divider: true
        },
        {
            label: 'Remove job',
            icon: <DeleteIcon />,
            onClick: () => removeJob(job.id)
        }
    ]

    return <MoreMenu options={menuOptions} />
}

export default OptionsMenu
