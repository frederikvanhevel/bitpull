import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { ScrollNode } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: ScrollNode
    onUpdate: (key: string, value: any) => void
}

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

const Scroll: React.FC<Props> = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <div className={classes.inlineInput}>
                <Typography>Scroll the whole page to the bottom</Typography>
            </div>
        </div>
    )
}

export default Scroll
