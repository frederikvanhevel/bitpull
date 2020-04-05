import React from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

type Props = ButtonProps & {
    loading?: boolean
}

const useStyles = makeStyles({
    root: {
        color: 'white'
    }
})

const LoadingButton: React.FC<Props> = ({ loading, children, ...props }) => {
    const classes = useStyles()

    return (
        <Button {...props}>
            {loading ? (
                <CircularProgress size={22} classes={classes} />
            ) : (
                children
            )}
        </Button>
    )
}

export default LoadingButton
