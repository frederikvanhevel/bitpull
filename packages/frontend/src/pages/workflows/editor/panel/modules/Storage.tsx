import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { StorageNode } from '@bitpull/worker/lib/typedefs'
import { Link } from 'react-router-dom'

interface Props {
    node: StorageNode
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

const Storage: React.FC<Props> = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Typography>
                Results will be stored on our servers for later access. You will
                be able to access this data from the{' '}
                <Link to="/storage">storage page</Link>.
            </Typography>
        </div>
    )
}

export default Storage
