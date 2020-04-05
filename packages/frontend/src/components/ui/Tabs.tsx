import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Tabs as MUITabs, Tab } from '@material-ui/core'

export interface Tab {
    label: string
    disabled: boolean
}

interface Props {
    activeTab: number
    className?: string
    color: 'primary' | 'secondary'
    onChange: (e: any, tab: number) => void
    tabs: Tab[]
}

const useStyles = makeStyles((theme: Theme) => ({
    tabs: {
        width: 'calc(100% - 1px)',
        margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px 0`,
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        borderTop: `1px solid ${theme.palette.grey['300']}`
    },
    tabsIndicator: {
        top: 0,
        zIndex: 2
    },
    tab: {
        minWidth: '1px',
        maxWidth: '50%',
        flexGrow: 1,
        textTransform: 'none'
    },
    tabSelected: {
        backgroundColor: '#ffffff',
        border: 'none',
        zIndex: 1,
        boxShadow:
            '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
    },
    tabDisabled: {
        color: `${theme.palette.grey['400']} !important`
    },
    error: {
        color: `${theme.palette.error.main} !important`
    }
}))

const Tabs: React.FC<Props> = ({
    activeTab = 0,
    className,
    color = 'primary',
    onChange,
    tabs
}) => {
    const classes = useStyles()

    return (
        <MUITabs
            classes={{
                root: `${classes.tabs} ${className || ''}`,
                indicator: classes.tabsIndicator
            }}
            value={activeTab}
            indicatorColor={color}
            textColor={color}
            onChange={onChange}
        >
            {tabs &&
                tabs.map((t, idx) => (
                    <Tab
                        classes={{
                            root: classes.tab,
                            selected: classes.tabSelected,
                            disabled: classes.tabDisabled
                        }}
                        key={`tab_${idx}`}
                        label={t.label}
                        disabled={t.disabled}
                    />
                ))}
        </MUITabs>
    )
}

export default Tabs
