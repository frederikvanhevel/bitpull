import React, { useState, ElementType, useEffect } from 'react'
import cx from 'classnames'
import format from 'date-fns/format'
import differenceInDays from 'date-fns/differenceInDays'
import {
    makeStyles,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination,
    Theme,
    Link
} from '@material-ui/core'
import PdfIcon from '@material-ui/icons/PictureAsPdf'
import ImageIcon from '@material-ui/icons/Image'
import JsonIcon from 'components/ui/icons/json-icon'
import ExcelIcon from 'components/ui/icons/excel-icon'
import { StorageLink } from 'queries/storage/typedefs'
import { useQuery } from '@apollo/react-hooks'
import {
    getStorageEntry,
    getStorageEntryVariables
} from 'queries/storage/typedefs/getStorageEntry'
import { GET_STORAGE_ENTRY } from 'queries/storage'
import Loader from 'components/ui/Loader'
import { isPast } from 'date-fns'
import { StorageService } from '@bitpull/worker/lib/typedefs'
import colors from 'constants/colors'

interface Props {
    entry: string
    count: number
}

const ICONS: Record<string, ElementType> = {
    'application/json': JsonIcon,
    'application/pdf': PdfIcon,
    'image/png': ImageIcon,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ExcelIcon
}

const SERVICE_NAME: Record<StorageService, string> = {
    [StorageService.NATIVE]: 'BitPull',
    [StorageService.DROPBOX]: 'Dropbox',
    [StorageService.GOOGLE_DRIVE]: 'Google Drive',
    [StorageService.ONEDRIVE]: 'OneDrive',
    [StorageService.GITHUB]: 'Github'
}

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        '& td': {
            fontSize: '0.8125rem'
        },
        '& th, & td': {
            paddingLeft: theme.spacing(3)
        },
        '& th:last-child, & td:last-child': {
            paddingRight: theme.spacing(3)
        }
    },
    fileName: {
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            marginRight: theme.spacing(1),
            fill: theme.palette.grey['700']
        }
    },
    expired: {
        pointerEvents: 'none',
        opacity: 0.5
    },
    strikeThrough: {
        textDecoration: 'line-through',

        '& > a': {
            color: 'black',
            pointerEvents: 'none',
            textDecoration: 'none'
        }
    },
    link: {
        color: colors.blueDark
    }
}))

const ROW_HEIGHT = 37

const StorageLinks: React.FC<Props> = ({ entry, count }) => {
    const classes = useStyles()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const { data, loading, refetch } = useQuery<
        getStorageEntry,
        getStorageEntryVariables
    >(GET_STORAGE_ENTRY, {
        fetchPolicy: 'cache-and-network',
        variables: {
            id: entry,
            limit: rowsPerPage,
            offset: page * rowsPerPage
        }
    })
    const minHeight = ROW_HEIGHT * (count + 3)

    const isExpired = (expiryDate: Date) => {
        return isPast(new Date(expiryDate))
    }

    useEffect(() => {
        refetch()
    }, [page, rowsPerPage])

    if (!data && loading) return <Loader hideText />

    const links = data?.getStorageEntry

    if (!links) return null

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell align="right">Added on</TableCell>
                    <TableCell align="right">Days until expiry</TableCell>
                </TableRow>
            </TableHead>
            <TableBody style={{ minHeight }}>
                {links.map((item: StorageLink) => {
                    const expired =
                        item.service === StorageService.NATIVE &&
                        isExpired(item.expiryDate)
                    const expiresAt = item.expiryDate
                        ? differenceInDays(
                              new Date(item.expiryDate),
                              new Date()
                          )
                        : null
                    const Icon = ICONS[item.contentType]

                    return (
                        <TableRow
                            key={item._id}
                            className={cx({
                                [classes.expired]: expired
                            })}
                        >
                            <TableCell>{SERVICE_NAME[item.service]}</TableCell>
                            <TableCell>
                                <div
                                    className={cx(classes.fileName, {
                                        [classes.strikeThrough]: expired
                                    })}
                                >
                                    {Icon ? <Icon /> : null}
                                    <Link
                                        href={item.url}
                                        target={
                                            item.service !==
                                            StorageService.NATIVE
                                                ? '_blank'
                                                : undefined
                                        }
                                        className={classes.link}
                                    >
                                        {item.fileName}
                                    </Link>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                {format(
                                    new Date(item.createdAt),
                                    'MM/dd/yyyy HH:mm:ss'
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {expiresAt !== null
                                    ? expiresAt >= 0
                                        ? expiresAt
                                        : 0
                                    : 'N/A'}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={(e, newPage) => setPage(newPage)}
                        onChangeRowsPerPage={e =>
                            setRowsPerPage(parseInt(e.target.value, 10))
                        }
                    />
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default StorageLinks
