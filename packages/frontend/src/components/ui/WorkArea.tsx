import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
    workArea: {
        position: 'relative',
        width: `100%`,
        height: 'calc(100vh - 123px)',
        marginTop: '64px',
        background: `linear-gradient(90deg, #fff 20px, transparent 1%) center,
		linear-gradient(#fff 20px, transparent 1%) center,
		${theme.palette.grey['200']}`,
        backgroundSize: '22px 22px'
    }
}))

const WorkArea: React.FC = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.workArea}>{children}</div>
}

export default WorkArea
