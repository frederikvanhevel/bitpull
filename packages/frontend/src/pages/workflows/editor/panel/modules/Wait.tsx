import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import { WaitNode } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: WaitNode
    onUpdate: (key: string, value: any) => void
}

const DEFAULT_DELAY = 5

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    inlineInput: {
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        },
        '& input': {
            width: 50,
            padding: theme.spacing(1)
        }
    }
}))

const Wait: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <div className={classes.inlineInput}>
                Wait{' '}
                <TextField
                    value={node.delay || DEFAULT_DELAY}
                    variant="outlined"
                    type="number"
                    error={isNaN(Number(node.delay || DEFAULT_DELAY))} // eslint-disable-line
                    onChange={e =>
                        onUpdate(
                            'delay',
                            e.target.value
                                ? Math.abs(Number(e.target.value))
                                : e.target.value
                        )
                    }
                />{' '}
                seconds before proceeding
            </div>
        </div>
    )
}

export default Wait
