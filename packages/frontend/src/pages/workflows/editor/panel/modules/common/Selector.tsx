import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    makeStyles,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core'
import SelectorIcon from '@material-ui/icons/Search'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import { validateSelector } from './validation'
import PageSelector from 'pages/workflows/editor/pageselector/PageSelector'
import Portal from 'components/ui/Portal'
import { Node } from 'typedefs/common'

export enum Attributes {
    TEXT = 'text',
    HREF = 'href',
    SRC = 'src'
}

interface Props {
    selector: HTMLSelector
    withAttribute?: boolean
    defaultAttribute?: Attributes
    node: Node
    label?: string
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

const Selector: React.FC<Props> = ({
    selector = {
        value: '',
        attribute: Attributes.TEXT
    },
    label = 'Selector',
    withAttribute = true,
    defaultAttribute = Attributes.TEXT,
    node,
    onUpdate
}) => {
    const classes = useStyles()
    const { register, errors, reset } = useForm<HTMLSelector>({
        defaultValues: selector,
        mode: 'onChange'
    })
    const onUpdateSelector = (key: string, value: any) => {
        onUpdate({
            ...selector,
            [key]: value
        })
    }
    const [pageSelectOpen, setPageSelectOpen] = useState(false)

    useEffect(() => {
        if (selector) reset(selector)
    }, [selector])

    return (
        <div className={classes.wrapper}>
            <TextField
                className={!withAttribute ? classes.fullWidth : undefined}
                label={label}
                placeholder="div > a"
                autoComplete="off"
                InputProps={{
                    endAdornment: (
                        <IconButton
                            className={classes.selectorButton}
                            onClick={() => setPageSelectOpen(true)}
                        >
                            <SelectorIcon />
                        </IconButton>
                    )
                }}
                error={!!errors.value}
                name="value"
                inputRef={register({
                    required: true,
                    validate: validateSelector
                })}
                onChange={e => onUpdateSelector('value', e.target.value)}
                inputProps={{ autoComplete: 'off' }}
                InputLabelProps={{ shrink: !!selector.value }}
            />

            {withAttribute && (
                <FormControl>
                    <InputLabel>Attribute</InputLabel>
                    <Select
                        value={selector.attribute || defaultAttribute}
                        onChange={e =>
                            onUpdateSelector('attribute', e.target.value)
                        }
                    >
                        {Object.values(Attributes).map(attr => (
                            <MenuItem key={attr} value={attr}>
                                {attr}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Portal id="pageSelector">
                <PageSelector
                    open={pageSelectOpen}
                    node={node}
                    initialSelector={selector.value}
                    onSelect={chosenSelector => {
                        onUpdateSelector('value', chosenSelector)
                        reset({
                            value: chosenSelector
                        })
                        setPageSelectOpen(false)
                    }}
                    onClose={() => setPageSelectOpen(false)}
                />
            </Portal>
        </div>
    )
}

export default Selector
