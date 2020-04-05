import React, { useEffect, useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

interface Props {
    time: Date
    future?: boolean
}

const ReadableTime: React.FC<Props> = ({ time, future }) => {
    const [dateString, setDateString] = useState(formatDistanceToNow(time))

    useEffect(() => {
        const id = setInterval(() => {
            setDateString(formatDistanceToNow(time))
        }, 1000)
        return () => clearInterval(id)
    })

    return (
        <time dateTime={time.toISOString()}>
            {future && 'in '}
            {dateString}
            {!future && ' ago'}
        </time>
    )
}

export default ReadableTime
