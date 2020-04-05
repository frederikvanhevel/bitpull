import React from 'react'
import { makeStyles } from '@material-ui/core'
import classnames from 'classnames'

interface Props {
    className?: string
    withTopbar?: boolean
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    withTopbar: {
        marginTop: '64px'
    }
}))

const PaddingWrapper: React.FC<Props> = ({
    children,
    className,
    withTopbar
}) => {
    const classes = useStyles()

    return (
        <div
            className={classnames(classes.wrapper, className, {
                [classes.withTopbar]: withTopbar
            })}
        >
            {children}
        </div>
    )
}

export default PaddingWrapper
