import React from 'react'
import {
    Typography,
    makeStyles,
    Card,
    Divider,
    CardContent,
    FormControlLabel,
    Switch,
    Theme
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreMenu from 'components/ui/MoreMenu'
import { IntegrationType } from 'typedefs/graphql'
import { redirect } from './helper'
import useIntegrations from 'hooks/useIntegrations'
import { Integration } from 'queries/integration'
import dropboxImage from './images/dropbox.svg'
import googleDriveImage from './images/google-drive.svg'
import oneDriveImage from './images/onedrive.svg'
import slackImage from './images/slack.svg'
import githubImage from './images/github.svg'

const IMAGES: Record<IntegrationType, string> = {
    [IntegrationType.DROPBOX]: dropboxImage,
    [IntegrationType.GOOGLE_DRIVE]: googleDriveImage,
    [IntegrationType.ONEDRIVE]: oneDriveImage,
    [IntegrationType.SLACK]: slackImage,
    [IntegrationType.GITHUB]: githubImage
}

interface Props {
    type: IntegrationType
    integration?: Integration
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        // width: 350
    },
    media: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '280px',
        '& > img': {
            width: '50%',
            height: '50%'
        }
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        '& label': {
            width: '100%',
            '& > span': {
                fontSize: '1.5rem'
            }
        }
    }
}))

const TITLES: Record<IntegrationType, string> = {
    [IntegrationType.DROPBOX]: 'Dropbox',
    [IntegrationType.GOOGLE_DRIVE]: 'Google Drive',
    [IntegrationType.ONEDRIVE]: 'OneDrive',
    [IntegrationType.SLACK]: 'Slack',
    [IntegrationType.GITHUB]: 'Github'
}

const DESCRIPTIONS: Record<IntegrationType, string> = {
    [IntegrationType.DROPBOX]: 'Upload your data to Dropbox.',
    [IntegrationType.GOOGLE_DRIVE]: 'Upload your data to Google Drive.',
    [IntegrationType.ONEDRIVE]: 'Upload your data to OneDrive.',
    [IntegrationType.SLACK]: 'Get notifed on Slack.',
    [IntegrationType.GITHUB]: 'Commit your data to a Github repository'
}

const IntegrationCard: React.FC<Props> = ({ type, integration = {} }) => {
    const classes = useStyles()
    const { toggle, remove } = useIntegrations()
    const menuItems = [
        {
            label: 'Remove integration',
            icon: <DeleteIcon />,
            onClick: () => remove(integration as Integration)
        }
    ]
    const onToggle = () => {
        if (integration.hasSettings) {
            toggle(integration as Integration)
        } else {
            redirect(type)
        }
    }

    return (
        <Card className={classes.card}>
            <div className={classes.media}>
                <img src={IMAGES[type]} />
            </div>

            <Divider />

            <CardContent>
                <div className={classes.title}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={integration.active || false}
                                onChange={() => onToggle()}
                                color="primary"
                            />
                        }
                        label={TITLES[type]}
                    />

                    {integration.hasSettings && (
                        <MoreMenu options={menuItems} />
                    )}
                </div>

                <Typography variant="caption">{DESCRIPTIONS[type]}</Typography>
            </CardContent>
        </Card>
    )
}

export default IntegrationCard
