import React from 'react'
import cx from 'classnames'
import TotalsWidget from './charts/TotalsWidget'
import useAnalytics from 'hooks/useAnalytics'
import { AnalyticsPeriod } from 'typedefs/graphql'
import { CheckCircle, Schedule, Error, Timeline } from '@material-ui/icons'
import HistoryChart from './charts/HistoryChart'
import JobSunnaryTable from './charts/JobSummaryTable'
import { Button, makeStyles, Theme, Paper, Typography } from '@material-ui/core'
import Toolbar from 'components/navigation/Toolbar'
import Refresh from 'components/ui/Refresh'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { TotalsPerDay } from 'queries/analytics/typedefs'
import IntroductionOverlay from './IntroductionOverlay'
import PageTitle from 'components/navigation/PageTitle'

const useStyles = makeStyles((theme: Theme) => ({
    actions: {
        '& button:first-child': {
            marginRight: theme.spacing(1)
        }
    },
    wrapper: {
        maxWidth: 1000,
        marginLeft: 'auto',
        marginRight: 'auto',
        transition: 'opacity .2s ease'
    },
    topWidgets: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(6)
    },
    loading: {
        opacity: '.5'
    },
    noData: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px',
        '& svg': {
            color: theme.palette.grey['500'],
            fontSize: '80px',
            marginBottom: theme.spacing(3)
        },
        '& h5': {
            color: theme.palette.grey['500']
        }
    },
    topBarButtons: {
        display: 'flex'
    },
    jobTable: {
        marginTop: theme.spacing(6)
    }
}))

const DashboardPage: React.FC = () => {
    const classes = useStyles()
    const {
        totalsPerDay,
        totalsPerJob,
        changePeriod,
        period,
        getTotals,
        refresh,
        lastRefresh
    } = useAnalytics(AnalyticsPeriod.LAST_WEEK)

    return (
        <>
            <PageTitle>Dashboard - BitPull</PageTitle>

            <IntroductionOverlay />

            <Toolbar>
                <div className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={period === AnalyticsPeriod.LAST_WEEK}
                        onClick={() => changePeriod(AnalyticsPeriod.LAST_WEEK)}
                    >
                        Last week
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={period === AnalyticsPeriod.LAST_MONTH}
                        onClick={() => changePeriod(AnalyticsPeriod.LAST_MONTH)}
                    >
                        Last month
                    </Button>
                </div>

                <div className={classes.topBarButtons}>
                    <Refresh
                        lastRefresh={lastRefresh}
                        onRefresh={() => {
                            refresh()
                            // setLastRefresh(new Date())
                        }}
                    />
                </div>
            </Toolbar>

            <PaddingWrapper
                withTopbar
                className={cx(classes.wrapper, {
                    [classes.loading]:
                        totalsPerDay.loading || totalsPerJob.loading
                })}
            >
                <div className={classes.topWidgets}>
                    <TotalsWidget
                        total={getTotals('total')}
                        label="Total jobs ran"
                        icon={<Schedule />}
                        status="default"
                    />
                    <TotalsWidget
                        total={getTotals('completed')}
                        label="Jobs completed"
                        icon={<CheckCircle />}
                        status="success"
                    />
                    <TotalsWidget
                        total={getTotals('failed')}
                        label="Jobs failed"
                        icon={<Error />}
                        status="error"
                    />
                </div>

                {totalsPerDay.data.length ? (
                    <>
                        {/* <SectionTitle>Job history</SectionTitle> */}
                        <Paper>
                            {totalsPerDay.data.length ? (
                                <HistoryChart
                                    data={totalsPerDay.data as TotalsPerDay[]}
                                />
                            ) : (
                                <div className={classes.noData}>
                                    <Timeline />
                                    <Typography variant="h5">
                                        There is no data to display yet.
                                        Schedule your first job to get started!
                                    </Typography>
                                </div>
                            )}
                        </Paper>

                        {/* <SectionTitle>Job overview</SectionTitle> */}

                        <Paper className={classes.jobTable}>
                            <JobSunnaryTable data={totalsPerJob.data} />
                        </Paper>
                    </>
                ) : (
                    <Paper>
                        <div className={classes.noData}>
                            <Timeline />
                            <Typography variant="h5">
                                There is no data to display yet. Schedule your
                                first job to get started!
                            </Typography>
                        </div>
                    </Paper>
                )}
            </PaddingWrapper>
        </>
    )
}

export default DashboardPage
