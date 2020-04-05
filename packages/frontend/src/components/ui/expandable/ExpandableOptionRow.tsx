import React, { ReactNode } from 'react'
import { makeStyles, Switch } from '@material-ui/core'
import ExpandableRow from './ExpandableRow'

interface Props {
    className?: string
    active: boolean
    disabled?: boolean
    onChange: (event: React.ChangeEvent<any>, checked: boolean) => void
    title: string
    titleIcon?: ReactNode
}

const useStyles = makeStyles(() => ({
    titleIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    switch: {
        margin: '-12px 0 -12px -12px'
    }
}))

const ExpandableOptionRow: React.FC<Props> = ({
    children,
    className,
    active,
    disabled,
    onChange,
    title,
    titleIcon
}) => {
    const classes = useStyles()
    const TitleIcon = (
        <div className={classes.titleIcon}>
            <Switch
                className={classes.switch}
                checked={active}
                onChange={onChange}
                color="primary"
            />
            {titleIcon}
        </div>
    )

    return (
        <ExpandableRow
            className={className}
            expandIcon={false}
            disabled={disabled}
            expanded={active}
            title={title}
            titleIcon={TitleIcon}
            onChange={onChange}
        >
            {children}
        </ExpandableRow>
    )
}

export default ExpandableOptionRow
