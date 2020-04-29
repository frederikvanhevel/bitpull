import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    makeStyles,
    TextField,
    FormControlLabel,
    Switch
} from '@material-ui/core'
import { HtmlNode, FlowNode, NodeType } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { URL_REGEX } from './common/validation'

interface Props {
    node: HtmlNode & Node
    onUpdate: (key: string, value: any) => void
    onReplace: (node: FlowNode) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        '& > div:not(:last-child)': {
            marginBottom: theme.spacing(1)
        }
    },
    link: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.spacing(3),
        '& > div:nth-child(1)': {
            flexGrow: 1
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`
    }
}))

const MultipleHtml: React.FC<Props> = ({ node, onUpdate, onReplace }) => {
    const classes = useStyles()
    const { register, errors, reset } = useForm<HtmlNode & Node>({
        defaultValues: node,
        mode: 'onChange'
    })

    useEffect(() => {
        reset(node)
    }, [node])

    return (
        <>
        <div className={classes.wrapper}>
            <FormControlLabel
                control={
                    <Switch
                        checked={true}
                        onChange={() => onReplace({
                            type: NodeType.HTML,
                            // @ts-ignore
                            link: ''
                        })}
                        color="primary"
                    />
                }
                label="Multiple"
            />

            <div className={classes.link}>
                    <TextField
                        error={!!errors.link}
                        label="Website url"
                        placeholder="http://example.com"
                        name="link"
                        autoFocus
                        inputRef={register({
                            required: true,
                            pattern: URL_REGEX
                        })}
                        onChange={e => onUpdate('link', e.target.value)}
                    />
            </div>
        </div>

        {/* {!!node.linkedField && <TestRunWarning />} */}
        </>
    )
}

export default MultipleHtml
