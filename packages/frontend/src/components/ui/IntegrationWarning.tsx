import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Link } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import Warning from './Warning'
import { IntegrationType } from '@bitpull/worker'
import { capitalizeWords } from 'utils/text'

type Props = {
    type: IntegrationType
}

const useStyles = makeStyles((theme: Theme) => ({
    link: {
        color: theme.palette.primary.light
    }
}))

const IntegrationWarning: React.FC<Props> = ({ type }) => {
    const classes = useStyles()
    const integration = capitalizeWords(type)

    return (
        <Warning>
            Your {integration} integration isn't set up correctly. Go to the{' '}
            <Link
                component={RouterLink}
                to="/integrations"
                className={classes.link}
            >
                integrations page
            </Link>{' '}
            to set it up.
        </Warning>
    )
}

export default IntegrationWarning
