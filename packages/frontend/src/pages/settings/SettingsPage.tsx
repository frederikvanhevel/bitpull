import React, { useState } from 'react'
import { makeStyles, Theme, Paper, Tabs, Tab } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'
import AccountTab from './tabs/AccountTab'
import PaymentTab from './tabs/PaymentTab'
import PageTitle from 'components/navigation/PageTitle'
import PaymentPlanTab from './tabs/PaymentPlanTab'

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        borderRadius: 0
    },
    lockedTab: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            fontSize: '16px',
            marginLeft: theme.spacing(1),
            marginBottom: '2px',
            fill: theme.palette.grey['700']
        }
    }
}))

enum SettingsTabs {
    ACCOUNT = 0,
    PAYMENT = 1,
    PLAN = 2
}

const PATH_TO_TAB: Record<string, SettingsTabs> = {
    account: SettingsTabs.ACCOUNT,
    payment: SettingsTabs.PAYMENT,
    plan: SettingsTabs.PLAN
}

const TAB_TO_PATH = Object.keys(PATH_TO_TAB)

const SettingsPage: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const { tab } = useParams()
    const [activeTab, setActiveTab] = useState(
        tab ? PATH_TO_TAB[tab] : SettingsTabs.ACCOUNT
    )

    return (
        <>
            <PageTitle>Settings - BitPull</PageTitle>

            <Paper className={classes.wrapper}>
                <Tabs
                    value={activeTab}
                    indicatorColor="primary"
                    onChange={(e, selectedTab) => {
                        setActiveTab(selectedTab)
                        history.push(`/settings/${TAB_TO_PATH[selectedTab]}`)
                    }}
                >
                    <Tab label="Account" />
                    <Tab label="Billing" />
                    <Tab label="Plan" />
                </Tabs>
            </Paper>

            {activeTab === 0 && <AccountTab />}
            {activeTab === 1 && <PaymentTab />}
            {activeTab === 2 && <PaymentPlanTab />}
        </>
    )
}

export default SettingsPage
