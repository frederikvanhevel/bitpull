import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import { ScreenshotNode } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: ScreenshotNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    }
}))

const Screenshot: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()

    return (
        <ExpandableOptionRow
            className={classes.expand}
            title="Full page screenshot"
            active={node.fullPage || false}
            onChange={e => onUpdate('fullPage', e.target.checked)}
        >
            <Typography variant="caption">
                A screenshot will be taken of the whole scrollable page
            </Typography>
        </ExpandableOptionRow>
    )
}

export default Screenshot
