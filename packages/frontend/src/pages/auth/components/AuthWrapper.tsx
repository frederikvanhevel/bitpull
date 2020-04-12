import React from 'react'
import { makeStyles, Container } from '@material-ui/core'
import Wave from 'components/wrappers/wave'

type Props = {
    size?: 'sm' | 'xs' | 'md' | 'lg' | 'xl'
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    gridContainer: {
        zIndex: 10,
        position: 'absolute',
        left: 0,
        right: 0
    }
}))

const AuthWrapper: React.FC<Props> = ({ children, size = 'sm' }) => {
    const classes = useStyles()

    return (
        <>
            <Container
                component="main"
                maxWidth={size}
                fixed
                className={classes.gridContainer}
            >
                {children}
            </Container>

            <Wave />
        </>
    )
}

export default AuthWrapper
