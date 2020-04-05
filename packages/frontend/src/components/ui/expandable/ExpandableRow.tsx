import React, { ReactNode } from 'react'
import {
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography
} from '@material-ui/core'

interface Props {
    className?: string
    expandIcon?: ReactNode
    disabled?: boolean
    expanded?: boolean
    onChange: (event: React.ChangeEvent<any>, expanded: boolean) => void
    title: string
    titleIcon: ReactNode
}

const useStyles = makeStyles(theme => ({
    row: {
        boxShadow: 'none',

        '&:hover': {
            backgroundColor: theme.palette.grey['100']
        },

        '&:before': {
            display: 'none'
        },

        '&:not(:first-child)': {
            // borderTop: `1px solid ${theme.palette.grey['300']}`
        }
    },
    rowDisabled: {
        // color: theme.palette.grey['300'],
        backgroundColor: 'transparent !important',

        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    icon: {
        paddingRight: theme.spacing(1),
        fontSize: '18px'
    },
    rowContent: {
        display: 'block',
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        paddingTop: 0
    },
    alignCenter: {
        alignSelf: 'center'
    },
    summary: {
        padding: `0 ${theme.spacing(1)}px`
    }
}))

const ExpandableRow: React.FC<Props> = ({
    children,
    className,
    expandIcon,
    disabled,
    expanded,
    onChange,
    title,
    titleIcon
}) => {
    const classes = useStyles()

    return (
        <ExpansionPanel
            expanded={expanded}
            disabled={disabled}
            classes={{
                root: `${classes.row} ${className || ''}`,
                disabled: classes.rowDisabled
            }}
            onChange={onChange}
        >
            <ExpansionPanelSummary
                expandIcon={expandIcon}
                classes={{
                    root: classes.summary
                }}
            >
                {titleIcon && <div className={classes.icon}>{titleIcon}</div>}
                <Typography variant="subtitle1" className={classes.alignCenter}>
                    {title}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{ root: classes.rowContent }}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default ExpandableRow
