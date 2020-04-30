import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles, TextField } from '@material-ui/core'
import { LowPriority } from '@material-ui/icons'
import { HtmlNode, NodeType, FlowNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import { URL_REGEX } from '../common/validation'
import MoreMenu from 'components/ui/MoreMenu'
import pathOr from 'ramda/es/pathOr'

interface Props {
    node: Node<HtmlNode>
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
        '& > div:nth-child(1)': {
            flexGrow: 1
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`
    }
}))

const SingleUrl: React.FC<Props> = ({ node, onUpdate, onReplace }) => {
    const classes = useStyles()
    const { register, errors, reset } = useForm<HtmlNode & Node>({
        defaultValues: node,
        mode: 'onChange'
    })
    const parent = node.parent as CollectNode
    const parentFields = pathOr<CollectField[]>([], ['fields'], parent).filter(
        field => !!field.label
    )
    const menuOptions = [
        {
            label: 'Convert to linked field',
            onClick: () => {
                onReplace({
                    type: NodeType.HTML_LINKED,
                    // @ts-ignore
                    linkedField: ''
                })
            },
            icon: <LowPriority />
        }
    ]

    useEffect(() => {
        reset(node)
    }, [node])

    return (
        <>
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

                {node.parent && !!parentFields.length && (
                    <MoreMenu options={menuOptions} />
                )}
            </div>
        </>
    )
}

export default SingleUrl
