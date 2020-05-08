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
import SimpleFlowChart from 'components/flowchart/SimpleFlowChart'

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

    useEffect(() => {
        if (data?.pickCatalogItem.id)
            history.push(`/workflow/${data?.pickCatalogItem.id}`)
    }, [data])

    return (
        <Card>
            <div className={classes.media}>
                <SimpleFlowChart node={item.node} />
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
                {!!item.description && (
                    <Typography variant="body2">{item.description}</Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default CatalogItem
