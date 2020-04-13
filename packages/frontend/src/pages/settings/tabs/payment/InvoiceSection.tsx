import React from 'react'
import {
    Typography,
    makeStyles,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Theme
} from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { GET_INVOICES } from 'queries/payment'
import { getInvoices } from 'queries/payment/typedefs/getInvoices'
import { format } from 'date-fns'
import { CloudDownload } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
    row: {
        display: 'flex',
        alignItems: 'center'
    },
    list: {
        width: '100%'
    },
    amount: {
        textAlign: 'right',
        marginRight: theme.spacing(2),
        '& > span': {
            fontWeight: '500'
        }
    },
    success: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
        textTransform: 'uppercase'
    }
}))

const InvoiceSection: React.FC = () => {
    const classes = useStyles()
    const { data, loading, error } = useQuery<getInvoices>(GET_INVOICES)

    if (loading && !data) return <CircularProgress />
    if (error || !data) {
        return <Typography color="error">Something went wrong</Typography>
    }

    return (
        <div className={classes.row}>
            <List classes={{ root: classes.list }}>
                {!data.getInvoices.length && (
                    <Typography>You don't have any invoices yet</Typography>
                )}

                {data.getInvoices.map(invoice => (
                    <ListItem
                        key={invoice.url}
                        disableGutters
                        button
                        onClick={() => window.open(invoice.url, '_self')}
                    >
                        <ListItemIcon>
                            <CloudDownload />
                        </ListItemIcon>
                        <ListItemText
                            primary={format(
                                new Date(invoice.date),
                                'MMMM do yyyy'
                            )}
                        />
                        <ListItemText
                            primary={`$${invoice.amount}`}
                            className={classes.amount}
                        />
                        <Chip
                            label={invoice.status.toUpperCase()}
                            classes={{
                                root:
                                    invoice.status === 'paid'
                                        ? classes.success
                                        : undefined
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default InvoiceSection
