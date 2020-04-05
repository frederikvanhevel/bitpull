import React from 'react'
import { makeStyles, Typography, Select, MenuItem } from '@material-ui/core'
import { PdfNode, PdfFormat } from '@bitpull/worker/lib/typedefs'

interface Props {
    node: PdfNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        },
        '& p': {
            marginBottom: theme.spacing(2)
        }
    }
}))

const Pdf: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Typography>PDF file format:</Typography>
            <Select
                value={node.format || 'A4'}
                onChange={e => onUpdate('format', e.target.value)}
            >
                {Object.values(PdfFormat).map(format => (
                    <MenuItem key={format} value={format}>
                        {format}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default Pdf
