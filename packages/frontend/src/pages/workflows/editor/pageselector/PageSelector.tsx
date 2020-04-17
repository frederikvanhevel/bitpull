import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Slide } from '@material-ui/core'
import SelectorTopControls from './SelectorTopControls'
import BrowserFrame from './BrowserFrame'
import { Node } from 'typedefs/common'

interface Props {
    open: boolean
    node: Node
    initialSelector?: string
    onSelect: (selector: string | undefined) => void
    onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 64,
        right: 0,
        bottom: 0,
        left: 240,
        zIndex: 105,
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        '& iframe': {
            width: '100%',
            height: '100%',
            border: 'none'
        }
    },
    fullHeight: {
        width: '100%',
        height: '100%',
        background: 'white'
    }
}))

const PageSelector: React.FC<Props> = ({ open, node, onSelect, onClose }) => {
    const classes = useStyles()
    const [currentSelector, setCurrentSelector] = useState<string>()

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <div className={classes.wrapper}>
                <SelectorTopControls
                    onConfirm={() => onSelect(currentSelector)}
                    currentSelector={currentSelector}
                    onClear={() => setCurrentSelector(undefined)}
                    onClose={onClose}
                />

                <div className={classes.fullHeight}>
                    <BrowserFrame
                        node={node}
                        setSelector={setCurrentSelector}
                        currentSelector={currentSelector}
                    />
                </div>
            </div>
        </Slide>
    )
}

export default PageSelector
