import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    FormControlLabel,
    Switch
} from '@material-ui/core'
import { Link, LowPriority } from '@material-ui/icons'
import { HtmlNode, FlowNode, NodeType } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import { URL_REGEX } from './common/validation'
import MoreMenu from 'components/ui/MoreMenu'
import pathOr from 'ramda/es/pathOr'
import TestRunWarning from './common/TestRunWarning'

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

const EditUrl: React.FC<Props> = ({ node, onUpdate, onReplace }) => {
    const classes = useStyles()
    const { register, errors, reset } = useForm<HtmlNode & Node>({
        defaultValues: node,
        mode: 'onChange'
    })
    const menuOptions = [
        node.link || node.link === ''
            ? {
                  label: 'Convert to linked field',
                  onClick: () => onUpdate('link', undefined),
                  icon: <LowPriority />
              }
            : {
                  label: 'Convert to link',
                  onClick: () => {
                      onUpdate('link', '')
                      onUpdate('linkedField', undefined)
                  },
                  icon: <Link />
              }
    ]
    const parent = node.parent as CollectNode
    const parentFields = pathOr<CollectField[]>([], ['fields'], parent).filter(
        field => !!field.label
    )

    useEffect(() => {
        reset(node)
    }, [node])

    return (
        <>
            <div className={classes.wrapper}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={false}
                            onChange={() =>
                                onReplace({
                                    type: NodeType.HTML_MULTIPLE,
                                    // @ts-ignore
                                    links: [node.link]
                                })
                            }
                            color="primary"
                        />
                    }
                    label="Multiple"
                />

                <div className={classes.link}>
                    {node.link || node.link === '' || !parentFields.length ? (
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
                    ) : (
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
                    )}

                    {node.parent && !!parentFields.length && (
                        <MoreMenu options={menuOptions} />
                    )}
                </div>

                <Button
                    onClick={() => {
                        onReplace({
                            type: NodeType.HTML_MULTIPLE,
                            // @ts-ignore
                            links: []
                        })
                    }}
                >
                    Multiple
                </Button>
            </div>

            {!!node.linkedField && <TestRunWarning />}
        </>
    )
}

export default EditUrl
