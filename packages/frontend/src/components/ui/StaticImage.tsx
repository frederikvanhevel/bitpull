import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

type Props = {
    image: string
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    image: {
        width: 140,
        height: '100%',
        marginBottom: theme.spacing(2)
    }
}))

const StaticImage: React.FC<Props> = ({ children, image }) => {
    const classes = useStyles()
    return (
        <div className={classes.wrapper}>
            <img className={classes.image} src={image} />
            {children}
        </div>
    )
}

export default StaticImage
