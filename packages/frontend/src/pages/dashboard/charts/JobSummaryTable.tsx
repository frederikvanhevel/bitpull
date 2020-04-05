import React from 'react'
import {
    Theme,
    makeStyles,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Typography
} from '@material-ui/core'
import { TotalsPerJob } from 'queries/analytics/typedefs'

const useStyles = makeStyles((theme: Theme) => ({
    failed: {
        color: theme.palette.error.light
    },
    completed: {
        color: theme.palette.success.light
    }
}))

type Props = {
    data: TotalsPerJob[]
}

const JobSunnaryTable: React.FC<Props> = ({ data }) => {
    const classes = useStyles()

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Job</TableCell>
                    <TableCell align="right" className={classes.completed}>
                        Completed
                    </TableCell>
                    <TableCell align="right" className={classes.failed}>
                        Failed
                    </TableCell>
                    <TableCell align="right">Total runs</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {!data.length && (
                    <TableRow>
                        <TableCell>
                            <Typography variant="body2">
                                No data available
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
                {data.map(row => (
                    <TableRow key={row.job.id}>
                        <TableCell>{row.job.name}</TableCell>
                        <TableCell align="right">
                            {(row.completed || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                            {(row.failed || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                            {(row.total || 0).toLocaleString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default JobSunnaryTable
