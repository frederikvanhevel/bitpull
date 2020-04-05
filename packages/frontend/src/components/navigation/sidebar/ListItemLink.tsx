import React, { ReactElement, forwardRef, ReactNode } from 'react'
import {
    makeStyles,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { LinkProps } from '@material-ui/core/Link'

interface Props {
    icon: ReactElement
    primary: ReactNode
    exact: boolean
    to: string
}

const useStyles = makeStyles(theme => ({
    link: {
        height: 48,
        color: 'white',
        '& svg': {
            fill: 'white'
        },
        '&:hover': {
            background: 'rgba(255,255,255,0.05)'
        }
    },
    activeLink: {
        background: 'rgba(255,255,255,0.11)',
        '& > div span': {
            fontWeight: '500',
            color: theme.palette.primary.main
        },
        '& svg': {
            fill: theme.palette.primary.main
        },
        '&:hover': {
            background: 'rgba(255,255,255,0.11)'
        }
    }
}))

const ListItemLink: React.SFC<Props> = ({ icon, primary, exact, to }) => {
    const classes = useStyles()

    const listComponent = forwardRef<HTMLAnchorElement, LinkProps>(
        (props, ref) => (
            // @ts-ignore
            <NavLink
                exact={exact}
                to={to}
                activeClassName={classes.activeLink}
                innerRef={ref}
                {...props}
            />
        )
    )

    return (
        <ListItem
            button
            component={listComponent}
            classes={{ root: classes.link }}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
        </ListItem>
    )
}

export default ListItemLink
