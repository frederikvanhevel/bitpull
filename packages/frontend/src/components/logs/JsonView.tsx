import React, { useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

interface Props {
    data: any
    onClose: () => void
}

const MAX_LINES = 10

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        position: 'relative',
        height: 400,
        width: '100%',
        borderRadius: theme.spacing(1) / 2
    },
    scrollable: {
        height: '100%',
        overflow: 'scroll',
        padding: theme.spacing(2),
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'rgb(232, 232, 232)',
        whiteSpace: 'pre',
        fontFamily: 'Menlo, Consolas, monospace',
        fontSize: '13px'
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        color: 'white'
    }
}))

const JsonView: React.FC<Props> = ({ data, onClose }) => {
    const classes = useStyles()
    const contentRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const isArray = Array.isArray(data)
    const isNestedArray = isArray && Array.isArray(data[0])

    let jsonString
    if (isNestedArray) {
        const trimmedData = data.slice(0, 1)

        if (trimmedData[0].length > MAX_LINES) {
            trimmedData[0] = trimmedData[0].slice(0, MAX_LINES)
            jsonString = JSON.stringify(trimmedData, null, 2)
                .replace(
                    `]`,
                    `  ... ${
                        data[0].length - MAX_LINES
                    } more items not shown\n  ]`
                )
                .replace(
                    /]$/,
                    `  ... ${data.length - 1} more page(s) not shown\n]`
                )
        } else {
            jsonString = JSON.stringify(trimmedData, null, 2)
        }
    } else if (isArray) {
        if (data.length > MAX_LINES) {
            const trimmedData = data.slice(0, MAX_LINES)
            jsonString = JSON.stringify(trimmedData, null, 2).replace(
                ']',
                `  ... ${data.length - MAX_LINES} more items not shown\n]`
            )
        } else {
            jsonString = JSON.stringify(data, null, 2)
        }
    } else {
        jsonString = JSON.stringify(data, null, 2)
    }

    return (
        <div className={classes.wrapper}>
            <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>

            <div className={classes.scrollable}>
                {data ? (
                    <div>{jsonString}</div>
                ) : (
                    <div>No preview available</div>
                )}
            </div>
            <div ref={contentRef} />
        </div>
    )
}

export default JsonView
