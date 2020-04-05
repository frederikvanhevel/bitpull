import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Typography,
    Card,
    CardContent,
    makeStyles,
    Divider,
    Button,
    Theme
} from '@material-ui/core'
import { CatalogItem } from 'queries/catalog/typedefs'
import { PICK_CATALOG_ITEM } from 'mutations/catalog'
import { useMutation } from '@apollo/react-hooks'
import {
    pickCatalogItem,
    pickCatalogItemVariables
} from 'mutations/catalog/typedefs/pickCatalogItem'
import twitter from './images/twitter.svg'
import newyorktimes from './images/new-york-times.svg'
import medium from './images/medium.svg'
import producthunt from './images/product-hunt.svg'
import bookingcom from './images/bookingcom.svg'
import ebay from './images/ebay.svg'
import hackernews from './images/hackernews.svg'
import tripadvisor from './images/tripadvisor.svg'
import google from './images/google.svg'

const IMAGES: Record<string, string> = {
    default: twitter,
    twitter,
    newyorktimes,
    medium,
    producthunt,
    bookingcom,
    ebay,
    hackernews,
    tripadvisor,
    google
}

interface Props {
    item: CatalogItem
}

const useStyles = makeStyles((theme: Theme) => ({
    media: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '280px',
        '& > img': {
            maxWidth: '50%',
            height: '50%'
        }
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    }
}))

const CatalogItem: React.FC<Props> = ({ item }) => {
    const classes = useStyles()
    const history = useHistory()
    const [pickItem, { data, loading }] = useMutation<
        pickCatalogItem,
        pickCatalogItemVariables
    >(PICK_CATALOG_ITEM)
    const image = IMAGES[item.name] || IMAGES.default

    useEffect(() => {
        if (data?.pickCatalogItem.id)
            history.push(`/workflow/${data?.pickCatalogItem.id}`)
    }, [data])

    return (
        <Card>
            <div className={classes.media}>
                <img src={image} />
            </div>

            <Divider />

            <CardContent>
                <div className={classes.inline}>
                    <Typography variant="h5">{item.title}</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        onClick={() =>
                            pickItem({
                                variables: {
                                    id: item.id
                                }
                            })
                        }
                    >
                        Select
                    </Button>
                </div>
                {/* <Typography variant="body2">Scrape twitter feeds</Typography> */}
            </CardContent>
        </Card>
    )
}

export default CatalogItem
