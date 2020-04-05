import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import Loader from 'components/ui/Loader'
import IntegrationCard from './IntegrationCard'
import Toolbar from 'components/navigation/Toolbar'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { IntegrationType } from 'typedefs/graphql'
import useIntegrations from 'hooks/useIntegrations'
import PageTitle from 'components/navigation/PageTitle'

const useStyles = makeStyles(theme => ({
    header: {
        borderRadius: 0,
        padding: theme.spacing(3)
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        '& > div': {
            marginRight: theme.spacing(3),
            marginBottom: theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
                flexBasis: `calc(50% - ${theme.spacing(3)}px)`
            },
            [theme.breakpoints.up('md')]: {
                flexBasis: `calc(33% - ${theme.spacing(3)}px)`
            },
            [theme.breakpoints.up('xl')]: {
                flexBasis: `calc(25% - ${theme.spacing(3)}px)`
            }
        }
    }
}))

const AVAILABLE_INTEGRATIONS = Object.values(IntegrationType)

const IntegrationsListPage: React.FC = () => {
    const classes = useStyles()
    const { integrations, loading } = useIntegrations()

    if (loading) return <Loader />

    return (
        <>
            <PageTitle>Integrations - BitPull</PageTitle>

            <Toolbar>
                <Typography variant="body2">
                    Toggle integrations that you can use inside your workflows
                </Typography>
            </Toolbar>

            <PaddingWrapper withTopbar>
                <div className={classes.cards}>
                    {AVAILABLE_INTEGRATIONS.map(type => (
                        <IntegrationCard
                            key={type}
                            type={type}
                            integration={integrations.find(
                                integration => integration.type === type
                            )}
                        />
                    ))}
                </div>
            </PaddingWrapper>
        </>
    )
}

export default IntegrationsListPage
