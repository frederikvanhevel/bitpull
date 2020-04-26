import React, { useRef, useEffect } from 'react'
import format from 'date-fns/format'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import { ParseLog, LogType } from '@bitpull/worker/lib/typedefs'

interface Props {
    logs: ParseLog[]
    onClose: () => void
}

// see webpack-hot-middleware-clientOverlay
// https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/client-overlay.js
const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        position: 'relative',
        minHeight: '400px',
        borderRadius: theme.spacing(1) / 2
        // background: 'rgba(0, 0, 0, 0.85)'
    },
    scrollable: {
        height: '100%',
        overflow: 'scroll',
        padding: theme.spacing(2),
        color: 'rgb(232, 232, 232)',
        whiteSpace: 'pre',
        fontFamily: 'Menlo, Consolas, monospace',
        fontSize: '13px'
    },
    logMessage: {
        marginBottom: '2px'
    },
    date: {
        color: '#B3CB74'
    },
    error: {
        backgroundColor: '#E36049',
        color: '#fff',
        padding: '2px 4px',
        borderRadius: '2px',
        marginRight: theme.spacing(1)
    },
    warning: {
        backgroundColor: '#FFD080',
        color: '#000',
        padding: '2px 4px',
        borderRadius: '2px',
        marginRight: theme.spacing(1)
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        color: 'white'
    }
}))

const LogView: React.FC<Props> = ({ logs, onClose }) => {
    const classes = useStyles()
    const contentRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const logClasses = {
        [LogType.ERROR]: classes.error,
        [LogType.WARN]: classes.warning
    }

    useEffect(() => {
        contentRef.current.scrollIntoView()
    }, [contentRef])

    return (
        <div className={classes.wrapper}>
            <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>

            <div className={classes.scrollable}>
                {logs.length ? (
                    logs.map(log => (
                        <div
                            key={new Date(log.date).getTime()}
                            className={classes.logMessage}
                        >
                            <span className={classes.date}>
                                {format(new Date(log.date), 'Ppp')}
                            </span>{' '}
                            {log.type === LogType.ERROR ||
                            log.type === LogType.WARN ? (
                                <span className={logClasses[log.type]}>
                                    {log.type.toUpperCase()}
                                </span>
                            ) : null}
                            {log.message}
                        </div>
                    ))
                ) : (
                    <div className={classes.logMessage}>No logs available</div>
                )}
            </div>
            <div ref={contentRef} />
        </div>
    )
}

export default LogView
