import React from 'react'
import { Theme, makeStyles, useTheme } from '@material-ui/core'
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from 'recharts'
import { format } from 'date-fns'
import { TotalsPerDay } from 'queries/analytics/typedefs'

const useStyles = makeStyles((theme: Theme) => ({
    chart: {
        fontFamily: theme.typography.fontFamily,
        width: '100%',
        height: '400px',
        padding: theme.spacing(4),
        '& text': {
            fontSize: '11px'
        }
    }
}))

type Props = {
    data: TotalsPerDay[]
}

const HistoryChart: React.FC<Props> = ({ data }) => {
    const classes = useStyles()
    const theme = useTheme()

    const tooltipStyle = {
        border: `1px solid ${theme.palette.grey['300']}`,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        padding: '4px 8px',
        fontWeight: theme.typography.fontWeightMedium
    }

    const labelStyle = {
        marginBottom: theme.spacing(1)
    }

    return (
        <div className={classes.chart}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: -30 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        tickLine={false}
                        axisLine={false}
                        dataKey="date"
                        tickFormatter={value =>
                            format(new Date(value), 'MMM do')
                        }
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={labelStyle}
                        labelFormatter={value =>
                            new Date(value).toLocaleDateString()
                        }
                        cursor={{ fill: theme.palette.grey['100'] }}
                    />
                    <Bar
                        dataKey="completed"
                        stackId="a"
                        fill={theme.palette.success.light}
                    />
                    <Bar
                        dataKey="failed"
                        stackId="a"
                        fill={theme.palette.error.light}
                        // radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default HistoryChart
