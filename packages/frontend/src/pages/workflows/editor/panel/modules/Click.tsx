import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import Selector from './common/Selector'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import { ClickNode } from '@bitpull/worker/lib/typedefs'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'

interface Props {
    node: ClickNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    },
    inlineInput: {
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        },
        '& input': {
            width: 50,
            padding: theme.spacing(1)
        }
    }
}))

const Click: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()

    return (
        <>
            <div className={classes.wrapper}>
                <Selector
                    label="Click element selector"
                    selector={{ value: node.selector }}
                    node={node}
                    withAttribute={false}
                    onUpdate={(selector: HTMLSelector) =>
                        onUpdate('selector', selector.value)
                    }
                />
            </div>
            <ExpandableOptionRow
                className={classes.expand}
                title="Wait before continuing"
                active={node.delay !== undefined}
                onChange={e => {
                    onUpdate('delay', e.target.checked ? 5 : undefined)
                }}
            >
                <div className={classes.inlineInput}>
                    Wait{' '}
                    <TextField
                        value={node.delay || 5}
                        variant="outlined"
                        type="number"
                        error={isNaN(Number(node.delay))} // eslint-disable-line
                        onChange={e =>
                            onUpdate(
                                'delay',
                                e.target.value
                                    ? Math.abs(Number(e.target.value))
                                    : e.target.value
                            )
                        }
                    />{' '}
                    seconds before proceeding
                </div>
            </ExpandableOptionRow>
        </>
    )
}

export default Click
