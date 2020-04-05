import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { IntegrationType } from '@bitpull/worker/lib/typedefs'
import { OnedriveNode } from '@bitpull/worker/lib/typedefs'
import useIntegrations from 'hooks/useIntegrations'
import IntegrationWarning from 'components/ui/IntegrationWarning'

interface Props {
    node: OnedriveNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    }
}))

const OneDrive: React.FC<Props> = () => {
    const classes = useStyles()
    const { integrations, loading } = useIntegrations()
    const oneDriveIntegration = integrations.find(
        integration => integration.type === IntegrationType.ONEDRIVE
    )
    const valid = !!(oneDriveIntegration && oneDriveIntegration.active)

    return (
        <div>
            {!loading && !valid ? (
                <div className={classes.wrapper}>
                    <IntegrationWarning type={IntegrationType.ONEDRIVE} />
                </div>
            ) : (
                <div className={classes.wrapper}>
                    <Typography>Files will be uploaded to OneDrive</Typography>
                </div>
            )}
        </div>
    )
}

export default OneDrive
