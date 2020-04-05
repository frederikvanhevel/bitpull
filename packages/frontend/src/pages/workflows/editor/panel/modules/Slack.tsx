import React from 'react'
import {
    makeStyles,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText
} from '@material-ui/core'
import { IntegrationType } from '@bitpull/worker/lib/typedefs'
import { SlackNode } from '@bitpull/worker/lib/typedefs'
import { useQuery } from '@apollo/react-hooks'
import { GET_SLACK_CHANNELS } from 'queries/integration'
import { getSlackChannels } from 'queries/integration/typedefs/getSlackChannels'
import useIntegrations from 'hooks/useIntegrations'
import IntegrationWarning from 'components/ui/IntegrationWarning'

interface Props {
    node: SlackNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        },
        '& p': {
            marginBottom: theme.spacing(2)
        },
        minHeight: 105
    }
}))

const Slack: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const { integrations, loading } = useIntegrations()
    const slackIntegration = integrations.find(
        integration => integration.type === IntegrationType.SLACK
    )
    const { data, loading: loadingChannels, error } = useQuery<
        getSlackChannels
    >(GET_SLACK_CHANNELS)
    const channels = error || !data ? [] : data.getSlackChannels
    const valid = !!(slackIntegration && slackIntegration.active)

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6">Get notified on Slack</Typography>
            <FormControl>
                <InputLabel shrink={!!node.channel}>
                    {loadingChannels ? 'Loading ...' : 'Select a channel'}
                </InputLabel>
                <Select
                    disabled={!valid || loadingChannels}
                    value={node.channel || ''}
                    onChange={e => onUpdate('channel', e.target.value)}
                >
                    {!channels.length && (
                        <MenuItem value={''} disabled>
                            Select a channel
                        </MenuItem>
                    )}
                    {channels.map((channel: any) => (
                        <MenuItem key={channel.id} value={channel.name}>
                            <ListItemText primary={`# ${channel.name}`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!loading && !valid && (
                <>
                    <p />

                    <IntegrationWarning type={IntegrationType.SLACK} />
                </>
            )}
        </div>
    )
}

export default Slack
