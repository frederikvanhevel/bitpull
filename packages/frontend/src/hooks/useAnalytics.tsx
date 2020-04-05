import { useQuery } from '@apollo/react-hooks'
import { getTotalsPerDay } from 'queries/analytics/typedefs/getTotalsPerDay'
import { GET_ANALYTICS_PER_DAY, GET_ANALYTICS_PER_JOB } from 'queries/analytics'
import { AnalyticsPeriod } from 'typedefs/graphql'
import { getTotalsPerJob } from 'queries/analytics/typedefs/getTotalsPerJob'
import { eachDayOfInterval, subMonths, isSameDay, subWeeks } from 'date-fns'
import { TotalsPerDay } from 'queries/analytics/typedefs'
import { useState } from 'react'

const POLL_INTERVAL = 20000

const useAnalytics = (chosenPeriod: AnalyticsPeriod) => {
    const [period, setPeriod] = useState(chosenPeriod)
    const [lastRefresh, setLastRefresh] = useState(new Date())
    const totalsPerDayResult = useQuery<getTotalsPerDay>(
        GET_ANALYTICS_PER_DAY,
        {
            fetchPolicy: 'cache-and-network',
            pollInterval: POLL_INTERVAL,
            variables: {
                period
            },
            onCompleted: () => setLastRefresh(new Date())
        }
    )

    const getTotalsPerJobResult = useQuery<getTotalsPerJob>(
        GET_ANALYTICS_PER_JOB,
        {
            fetchPolicy: 'cache-and-network',
            pollInterval: POLL_INTERVAL,
            variables: {
                period
            }
        }
    )

    const dateRange = eachDayOfInterval({
        start:
            period === AnalyticsPeriod.LAST_MONTH
                ? subMonths(new Date(), 1)
                : subWeeks(new Date(), 1),
        end: new Date()
    })

    const totalsPerDay: TotalsPerDay[] = totalsPerDayResult.data
        ? totalsPerDayResult.data.getTotalsPerDay
        : []

    const mappedDateRange = dateRange.map((date: Date) => {
        const entry = totalsPerDay.find(d => isSameDay(date, new Date(d.date)))
        return (
            entry || {
                date: date.toISOString(),
                completed: 0,
                failed: 0,
                total: 0,
                __typename: 'TotalsPerDay'
            }
        )
    })

    const getTotals = (status: 'completed' | 'failed' | 'total') =>
        mappedDateRange.reduce((prev, current) => prev + current[status], 0)

    const refresh = () => {
        totalsPerDayResult.refetch()
        getTotalsPerJobResult.refetch()
    }

    const changePeriod = (newPeriod: AnalyticsPeriod) => {
        setPeriod(newPeriod)
    }

    return {
        getTotals,
        totalsPerDay: {
            loading: totalsPerDayResult.loading,
            data: mappedDateRange
        },
        totalsPerJob: {
            loading: getTotalsPerJobResult.loading,
            data: getTotalsPerJobResult.data
                ? getTotalsPerJobResult.data.getTotalsPerJob
                : []
        },
        period,
        changePeriod,
        refresh,
        lastRefresh
    }
}

export default useAnalytics
