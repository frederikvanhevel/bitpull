import React from 'react'
import cx from 'classnames'
import querystring from 'query-string'
import { Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import googleIcon from './images/google-icon.svg'

type Props = {
    label: string
    size?: 'medium' | 'large' | 'small'
    referralId?: string
    className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        width: '100%',
        backgroundColor: 'white'
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: theme.spacing(1)
    }
}))

const GoogleSignIn: React.FC<Props> = ({
    label,
    referralId,
    className,
    size
}) => {
    const classes = useStyles()

    function goToAuthPage() {
        const queryString = querystring.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            scope: 'openid profile email',
            response_type: 'code',
            redirect_uri: `${document.location.origin}/auth/callback/google`,
            access_type: 'offline',
            state: referralId
        })
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`
    }

    return (
        <Button
            onClick={goToAuthPage}
            variant="contained"
            size={size}
            classes={{ root: cx(classes.button, className) }}
        >
            <img src={googleIcon} className={classes.icon} /> {label}
        </Button>
    )
}

export default GoogleSignIn
