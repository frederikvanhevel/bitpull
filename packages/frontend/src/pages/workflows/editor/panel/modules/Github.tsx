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
import { GithubNode } from '@bitpull/worker/lib/typedefs'
import { useQuery } from '@apollo/react-hooks'
import { GET_GITHUB_REPOS } from 'queries/integration'
import useIntegrations from 'hooks/useIntegrations'
import IntegrationWarning from 'components/ui/IntegrationWarning'
import { getGithubRepositories } from 'queries/integration/typedefs/getGithubRepositories'

interface Props {
    node: GithubNode
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

const Github: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const { integrations, loading } = useIntegrations()
    const githubIntegration = integrations.find(
        integration => integration.type === IntegrationType.GITHUB
    )
    const { data, loading: loadingRepos, error } = useQuery<
        getGithubRepositories
    >(GET_GITHUB_REPOS)
    const repos = error || !data ? [] : data.getGithubRepositories
    const valid = !!(githubIntegration && githubIntegration.active)

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6">Upload file to Github</Typography>

            <br />

            <FormControl>
                <InputLabel shrink={!!node.repo}>
                    {loadingRepos ? 'Loading ...' : 'Select a repository'}
                </InputLabel>
                <Select
                    disabled={!valid || loadingRepos}
                    value={node.repo || ''}
                    onChange={e => {
                        onUpdate('repo', e.target.value)
                    }}
                >
                    {!repos.length && (
                        <MenuItem value={''} disabled>
                            Select a repository
                        </MenuItem>
                    )}
                    {repos.map((repo: any) => (
                        <MenuItem
                            key={repo.name}
                            value={`${repo.owner}/${repo.name}`}
                        >
                            <ListItemText
                                primary={repo.name}
                                secondary={repo.owner}
                            />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!loading && !valid && (
                <>
                    <p />

                    <IntegrationWarning type={IntegrationType.GITHUB} />
                </>
            )}
        </div>
    )
}

export default Github
