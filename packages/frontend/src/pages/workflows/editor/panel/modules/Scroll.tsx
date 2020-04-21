import React from 'react'
import { makeStyles } from '@material-ui/core'
import { ScrollNode } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: ScrollNode
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

const Scroll: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <div className={classes.inlineInput}>
                Scroll
            </div>
        </div>
    )
}

export default Scroll
