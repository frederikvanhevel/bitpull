import React from 'react'
import { makeStyles, FormHelperText, Link } from '@material-ui/core'
import { Warning, Info } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/store'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing(2, 3),
        background: theme.palette.warning.light
    },
    icon: {
        height: 16,
        marginRight: theme.spacing(2),
        '& path': {
            fill: theme.palette.warning.contrastText
        }
    },
    text: {
        color: theme.palette.warning.contrastText
    }
}))

const TestRunWarning: React.FC = () => {
    const classes = useStyles()
    const workflowId = useSelector<AppState, string | undefined>(
        state => state.workflow.currentWorkflow?.id
    )

    const link = workflowId ? `/jobs/new?workflow=${workflowId}` : '/jobs/new'

    return (
        <FormHelperText className={classes.wrapper}>
            <Info className={classes.icon} />
            <div className={classes.text}>Only one page will be followed during test runs. <Link component={RouterLink} to={link}>Schedule a job</Link> to scrape without limitations.</div>
        </FormHelperText>
    )
}

export default TestRunWarning
