import React, { useState } from 'react'
import { makeStyles, Button } from '@material-ui/core'
import SelectorIcon from '@material-ui/icons/Search'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import PageSelector from 'pages/workflows/editor/pageselector/PageSelector'
import Portal from 'components/ui/Portal'
import { Node } from 'typedefs/common'

export enum Attributes {
    TEXT = 'text',
    HREF = 'href',
    SRC = 'src'
}

interface Props {
    label?: string
    selector: HTMLSelector
    node: Node
    onUpdate: (selector: HTMLSelector) => void
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& > div:first-child': {
            flexBasis: '68%'
        },
        '& > div:last-child': {
            flexBasis: '28%'
        }
    },
    fullWidth: {
        flexBasis: '100% !important'
    },
    selectorButton: {
        margin: '-12px'
    }
}))

const SelectorButton: React.FC<Props> = ({
    label,
    selector = {
        value: '',
        attribute: Attributes.TEXT
    },
    node,
    onUpdate
}) => {
    const classes = useStyles()

    const onUpdateSelector = (key: string, value: any) => {
        onUpdate({
            ...selector,
            [key]: value
        })
    }
    const [pageSelectOpen, setPageSelectOpen] = useState(false)

    return (
        <div className={classes.wrapper}>
            <Button
                onClick={() => setPageSelectOpen(true)}
                color="primary"
                size="small"
                fullWidth
            >
                <SelectorIcon />
                {label || 'Select element'}
            </Button>

            <Portal id="pageSelector">
                <PageSelector
                    open={pageSelectOpen}
                    node={node}
                    initialSelector={selector.value}
                    onSelect={payload => {
                        onUpdateSelector('value', payload?.prediction)
                        setPageSelectOpen(false)
                    }}
                    onClose={() => setPageSelectOpen(false)}
                />
            </Portal>
        </div>
    )
}

export default SelectorButton
