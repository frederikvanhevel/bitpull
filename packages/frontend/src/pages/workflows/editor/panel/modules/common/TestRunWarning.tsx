import React from 'react'
import { makeStyles, FormHelperText } from '@material-ui/core'
import { Warning, Info } from '@material-ui/icons'

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
        marginRight: theme.spacing(0),
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

    return (
        <FormHelperText className={classes.wrapper}>
            <Info className={classes.icon} />
            <div className={classes.text}>Only one page will be followed during test runs</div>
        </FormHelperText>
    )
}

export default TestRunWarning
