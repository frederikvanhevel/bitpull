import React from 'react'
import StatusLabel, { Status } from './StatusLabel'
import { Job } from 'queries/job'

interface Props {
    job: Job
    onClick?: (jobId: string) => void
}

const getStatusList = (job: Job) => {
    if (job.status.running) return [Status.RUNNING]

    if (job.status.paused) return [Status.PAUSED]

    let list = []

    if (job.status.failed) list.push(Status.FAILED)

    if (job.status.completed && job.hasErrors)
        list.push(Status.COMPLETED_WITH_ERRORS)
    else if (job.status.completed) list.push(Status.COMPLETED)

    if (job.status.repeating) list.push(Status.REPEATING)
    else if (job.status.scheduled) list.push(Status.SCHEDULED)

    if (job.status.queued) list.push(Status.QUEUED)

    return list
}

const StatusList: React.FC<Props> = ({ job, onClick }) => {
    return (
        <>
            {getStatusList(job).map(status => (
                <StatusLabel
                    key={status}
                    status={status}
                    repeatInterval={job.repeatInterval}
                    onClick={() => onClick && onClick(job.id)}
                />
            ))}
        </>
    )
}

export default StatusList
