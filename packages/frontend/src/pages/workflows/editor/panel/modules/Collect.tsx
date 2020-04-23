import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles, TextField, Button, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Node } from 'typedefs/common'
import { CollectNode, CollectField } from '@bitpull/worker/lib/typedefs'
import MoreMenu from 'components/ui/MoreMenu'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import Selector from './common/Selector'
import { getNewCollectField } from '../helper'

interface Props {
    node: CollectNode & Node
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    fieldWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(3),
        '& > div:first-child': {
            flexGrow: 1
        },
        '& > div:last-child': {
            marginLeft: theme.spacing(1),
            flexBasis: '48px'
        },
        '&:nth-child(even)': {
            background: 'rgba(0,0,0,.03)',
            marginTop: 0
        }
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        '& > div:first-child': {
            marginBottom: theme.spacing(2)
        }
    },
    addButton: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(2)
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    },
    append: {
        padding: `0 ${theme.spacing(3)}px`
    }
}))

const Collect: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const [fields, setFields] = useState(node.fields)
    const { register, errors, reset } = useForm<CollectNode>({
        defaultValues: node,
        mode: 'onChange'
    })
    const onAddField = () => setFields([...fields, getNewCollectField()])
    const onUpdateField = (field: CollectField, key: string, value: any) => {
        onUpdate(
            'fields',
            fields.map(item =>
                field.id === item.id ? { ...field, [key]: value } : item
            )
        )
    }
    const onRemoveField = (field: CollectField) => {
        onUpdate(
            'fields',
            fields.filter(item => field.id !== item.id)
        )
    }
    const getMenuOptions = (field: CollectField) => [
        {
            label: 'Remove field',
            icon: <DeleteIcon />,
            onClick: () => onRemoveField(field)
        }
    ]

    useEffect(() => {
        setFields(node.fields)
        reset(node)
    }, [node])

    return (
        <div>
            {fields &&
                fields.map((field, index) => {
                    const fieldName = `fields[${index}]`
                    return (
                        <div
                            key={field.id || index}
                            className={classes.fieldWrapper}
                        >
                            <div className={classes.field}>
                                <TextField
                                    label="Your data field name"
                                    placeholder="name"
                                    error={
                                        errors.fields &&
                                        !!errors.fields[index]?.label
                                    }
                                    name={`${fieldName}.label`}
                                    inputRef={register({
                                        required: true
                                    })}
                                    onChange={e =>
                                        onUpdateField(
                                            field,
                                            'label',
                                            e.target.value
                                        )
                                    }
                                />
                                <Selector
                                    label="CSS selector"
                                    selector={field.selector}
                                    node={node}
                                    onUpdate={selector => {
                                        onUpdateField(
                                            field,
                                            'selector',
                                            selector
                                        )
                                    }}
                                />
                            </div>
                            <MoreMenu options={getMenuOptions(field)} />
                        </div>
                    )
                })}

            <div className={classes.addButton}>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={onAddField}
                >
                    Add field
                </Button>
            </div>

            <ExpandableOptionRow
                className={classes.expand}
                title="Merge with previous results"
                active={node.append || false}
                onChange={e => onUpdate('append', e.target.checked)}
            >
                <Typography variant="caption">
                    The data collected will be merged with the previous
                    collected data. For example from before pagination.
                </Typography>
            </ExpandableOptionRow>
        </div>
    )
}

export default Collect
