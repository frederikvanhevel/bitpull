import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core'
import { Link } from '@material-ui/icons'
import { HtmlNode, NodeType, FlowNode, LinkedHtmlNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import MoreMenu from 'components/ui/MoreMenu'
import pathOr from 'ramda/es/pathOr'

interface Props {
    node: Node<LinkedHtmlNode>
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

const LinkedUrl: React.FC<Props> = ({ node, onUpdate, onReplace }) => {
    const classes = useStyles()
    const parent = node.parent as CollectNode
    const parentFields = pathOr<CollectField[]>([], ['fields'], parent).filter(
        field => !!field.label
    )
    const menuOptions = [
        {
            label: 'Convert to link',
            onClick: () => {
              onReplace({
                  type: NodeType.HTML,
                  // @ts-ignore
                  link: ''
              })
            },
            icon: <Link />
        }
    ]

    return (
        <>
            <div className={classes.link}>
                <FormControl>
                    <InputLabel>Link from previous step</InputLabel>
                    <Select
                        value={node.linkedField}
                        placeholder="select "
                        name="linkedField"
                        onChange={e =>
                            onUpdate('linkedField', e.target.value)
                        }
                    >
                        {!parentFields.length ? (
                            <MenuItem value="none" disabled>
                                No fields available
                            </MenuItem>
                        ) : null}

                        {parentFields.map(field => {
                            return (
                                <MenuItem
                                    key={field.label}
                                    value={field.label}
                                >
                                    {field.label}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>

                <MoreMenu options={menuOptions} />
            </div>
        </>
    )
}

export default LinkedUrl
