import React from 'react'
import { makeStyles, Tooltip as MUITooltip } from '@material-ui/core'
import { Tooltip, TooltipType } from './typedefs'

interface Props {
    tooltip?: Tooltip
}

const useStyles = makeStyles(theme => ({
    container: {
        position: 'fixed'
    },
    tooltip: {
        background: 'rgba(97, 97, 97, 0.9)',
        color: theme.palette.common.white
    }
}))

const TOOLTIP_TEXT: Record<TooltipType, string> = {
    [TooltipType.BRANCH_DOWN]: 'Will only run after all other steps complete',
    [TooltipType.BRANCH_UP]: 'Step will be repeated',
    [TooltipType.BRANCH_UP_HTML]: 'Step will be repeated for each link found',
    [TooltipType.BRANCH_UP_PAGINATION]: 'Step will be repeated for each page'
}

const Tooltip: React.FC<Props> = ({ tooltip }) => {
    const classes = useStyles()

    if (!tooltip) return null

    const position = tooltip.position || { x: 0, y: 0 }

    return (
        <div
            className={classes.container}
            style={{ top: position.y, left: position.x }}
        >
            <MUITooltip
                open
                title={TOOLTIP_TEXT[tooltip.type]}
                placement="right"
                arrow
                classes={{ tooltip: classes.tooltip }}
            >
                <span />
            </MUITooltip>
        </div>
    )
}

export default Tooltip
