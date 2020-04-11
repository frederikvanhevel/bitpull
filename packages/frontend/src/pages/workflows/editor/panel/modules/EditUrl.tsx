import React from 'react'
import { useForm } from 'react-hook-form'
import {
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core'
import { Link, LowPriority } from '@material-ui/icons'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import { HtmlNode } from '@bitpull/worker/lib/typedefs'
import { XmlNode } from '@bitpull/worker/lib/typedefs'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import { URL_REGEX } from './common/validation'
import MoreMenu from 'components/ui/MoreMenu'
import pathOr from 'ramda/es/pathOr'

interface Props {
    node: (HtmlNode | XmlNode) & Node
    onUpdate: (key: string, value: any) => void
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
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        '& > div:nth-child(2)': {
            flexGrow: 1
        },
        '& > div:first-child': {
            flexBasis: '30%',
            marginRight: theme.spacing(2)
        },
        '& > div:last-child': {
            flexBasis: '4%'
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`
    }
}))

const EditUrl: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const { register, errors } = useForm<(HtmlNode | XmlNode) & Node>({
        defaultValues: node,
        mode: 'onChange'
    })
    const menuOption =
        node.link || node.link === ''
            ? {
                  label: 'Convert to linked field',
                  onClick: () => onUpdate('link', undefined),
                  icon: <LowPriority />
              }
            : {
                  label: 'Convert to link',
                  onClick: () => onUpdate('link', ''),
                  icon: <Link />
              }
    const parent = node.parent as CollectNode
    const parentFields = pathOr<CollectField[]>([], ['fields'], parent).filter(
        field => !!field.label
    )

    return (
        <div className={classes.wrapper}>
            <div className={classes.link}>
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={node.type}
                        onChange={e => onUpdate('type', e.target.value)}
                    >
                        <MenuItem value={NodeType.HTML}>HTML</MenuItem>
                        <MenuItem value={NodeType.XML}>XML</MenuItem>
                    </Select>
                </FormControl>

                {node.link || node.link === '' ? (
                    <TextField
                        error={!!errors.link}
                        label="Url"
                        placeholder="http://example.com"
                        name="link"
                        inputRef={register({
                            required: true,
                            pattern: URL_REGEX
                        })}
                        onChange={e => onUpdate('link', e.target.value)}
                    />
                ) : (
                    <FormControl>
                        <InputLabel>Url from collect field</InputLabel>
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

                {node.parent && <MoreMenu options={[menuOption]} />}
            </div>

            {node.type === NodeType.HTML && (
                <ExpandableOptionRow
                    className={classes.expand}
                    title="Disable javascript"
                    active={!node.parseJavascript || false}
                    onChange={(e, active) =>
                        onUpdate('parseJavascript', !active)
                    }
                >
                    <Typography variant="caption">
                        No javascript will be executed. This is faster, but
                        results might not be as expected.
                    </Typography>
                </ExpandableOptionRow>
            )}
        </div>
    )
}

export default EditUrl
