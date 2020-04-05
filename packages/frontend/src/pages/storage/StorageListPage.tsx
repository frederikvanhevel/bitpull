import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import Loader from 'components/ui/Loader'
import {
    makeStyles,
    Typography,
    Paper,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Theme,
    FormControlLabel,
    Switch
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Toolbar from 'components/navigation/Toolbar'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { useQuery } from '@apollo/react-hooks'
import {
    getStorageEntries,
    getStorageEntriesVariables
} from 'queries/storage/typedefs/getStorageEntries'
import { GET_STORAGE_ENTRIES } from 'queries/storage'
import StorageLinks from './StorageLinks'
import { ResourceType } from 'typedefs/graphql'
import Refresh from 'components/ui/Refresh'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { setFilter, clearNewStorageItems } from 'actions/storage'
import PageTitle from 'components/navigation/PageTitle'
import StaticImage from 'components/ui/StaticImage'
import storageImage from 'components/ui/icons/storage.svg'

const useStyles = makeStyles((theme: Theme) => ({
    lastRefresh: {
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        transition: 'opacity .2s ease'
    },
    loading: {
        opacity: '.5'
    },
    details: {
        // display: 'flex',
        // justifyContent: 'center',
        padding: 0
    },
    bold: {
        fontWeight: 500
    },
    type: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '100px',
        flexShrink: 0,
        fontWeight: 500,
        textTransform: 'uppercase',
        color: theme.palette.grey['400']
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    empty: {
        padding: `11px ${theme.spacing(2)}px`
    }
}))

const RESOURCE_LABEL: Record<ResourceType, string> = {
    [ResourceType.JOB]: 'Job',
    [ResourceType.TEST_RUN]: 'Test run'
}

const StorageListPage: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const filter = useSelector<AppState, ResourceType>(
        state => state.storage.filter
    )
    // const [filter, setFilter] = useState(ResourceType.JOB)
    const [expandedItem, setExpandedItem] = useState<string>()
    const [lastRefresh, setLastRefresh] = useState(new Date())
    const { data, loading, refetch } = useQuery<
        getStorageEntries,
        getStorageEntriesVariables
    >(GET_STORAGE_ENTRIES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            resourceType: filter
        }
    })
    const items = data ? data.getStorageEntries : []

    useEffect(() => {
        dispatch(clearNewStorageItems())
    }, [])

    if (!data && loading) return <Loader />

    return (
        <>
            <PageTitle>Storage - BitPull</PageTitle>

            <Toolbar>
                <FormControlLabel
                    control={
                        <Switch
                            checked={filter === ResourceType.TEST_RUN}
                            onChange={() => {
                                dispatch(
                                    setFilter(
                                        filter === ResourceType.TEST_RUN
                                            ? ResourceType.JOB
                                            : ResourceType.TEST_RUN
                                    )
                                )
                                setLastRefresh(new Date())
                            }}
                        />
                    }
                    label={
                        <Typography variant="body2">
                            View test results
                        </Typography>
                    }
                />
                <Typography variant="body2">
                    An overview of all files saved during scheduled jobs or test
                    runs
                </Typography>
                <Refresh
                    lastRefresh={lastRefresh}
                    onRefresh={() => {
                        setLastRefresh(new Date())
                        refetch()
                    }}
                />
            </Toolbar>

            <PaddingWrapper
                withTopbar
                className={classnames(classes.content, {
                    [classes.loading]: loading
                })}
            >
                {!items.length && !loading ? (
                    <Paper>
                        <StaticImage image={storageImage}>
                            <Typography variant="body2">
                                You have not saved any data yet.
                            </Typography>
                        </StaticImage>
                    </Paper>
                ) : null}

                {items.map(item => {
                    return (
                        <ExpansionPanel
                            key={item._id}
                            expanded={expandedItem === item._id}
                            TransitionProps={{ unmountOnExit: true }}
                            onChange={() =>
                                setExpandedItem(
                                    expandedItem !== item._id
                                        ? item._id
                                        : undefined
                                )
                            }
                        >
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography className={classes.type}>
                                    {RESOURCE_LABEL[item.resourceType]}
                                </Typography>
                                <Typography className={classes.heading}>
                                    {item.resourceName}
                                </Typography>
                                <Typography
                                    className={classes.secondaryHeading}
                                >
                                    {item.count} items
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails
                                classes={{ root: classes.details }}
                            >
                                <StorageLinks
                                    entry={item._id}
                                    count={item.count}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })}
            </PaddingWrapper>
        </>
    )
}

export default StorageListPage
