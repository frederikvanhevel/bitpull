import React from 'react'
import { makeStyles, Theme, Typography } from '@material-ui/core'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { useQuery } from '@apollo/react-hooks'
import { GET_CATALOG } from 'queries/catalog'
import { getCatalogItems } from 'queries/catalog/typedefs/getCatalogItems'
import ErrorScreen from 'components/ui/ErrorScreen'
import Loader from 'components/ui/Loader'
import CatalogItem from './CatalogItem'
import Toolbar from 'components/navigation/Toolbar'
import PageTitle from 'components/navigation/PageTitle'

const useStyles = makeStyles((theme: Theme) => ({
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

const CatalogPage: React.FC = () => {
    const classes = useStyles()
    const { data, loading, error } = useQuery<getCatalogItems>(GET_CATALOG)

    if (error) return <ErrorScreen />
    if (!data && loading) return <Loader />

    const items = data?.getCatalogItems || []

    return (
        <>
            <PageTitle>Templates - BitPull</PageTitle>

            <Toolbar>
                <Typography variant="body2">
                    Choose from a selection of premade workflows to help get you
                    started
                </Typography>
            </Toolbar>

            <PaddingWrapper withTopbar>
                <div className={classes.cards}>
                    {items.map(item => (
                        <CatalogItem key={item.id} item={item} />
                    ))}
                </div>
            </PaddingWrapper>
        </>
    )
}

export default CatalogPage
