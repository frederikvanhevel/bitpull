import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
    main: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0
    },
    inner: {
        backgroundImage: 'linear-gradient(90deg, #0aa6d2, #0077a1)',
        height: '50vh',
        minHeight: 450
    },
    wave: {
        position: 'absolute',
        left: 0,
        top: 'auto',
        bottom: -1,
        right: 0,
        width: '100%',
        height: '4vw'
    }
}))

const Wave: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.main}>
            <div className={classes.inner} />
            <img
                src="https://uploads-ssl.webflow.com/5e825e32da70701f1729a031/5e825e33fdba0f50ceb515f9_wave-bottom.svg"
                alt=""
                className={classes.wave}
            />
        </div>
    )
}

export default Wave
