import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { ExcelNode } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: ExcelNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    }
}))

const Excel: React.FC<Props> = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Typography>Data will be converted to Excel format</Typography>
        </div>
    )
}

export default Excel
