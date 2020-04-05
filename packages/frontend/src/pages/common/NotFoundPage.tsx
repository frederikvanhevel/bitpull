import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, Button, Theme } from '@material-ui/core'
import notFound from './images/not_found.svg'

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    image: {
        width: 400,
        marginBottom: theme.spacing(6)
    }
}))

const Toolbar: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <img src={notFound} className={classes.image} />
            <Button color="primary" variant="contained" component={Link} to="/">
                Go to homepage
            </Button>
        </div>
    )
}

export default Toolbar
