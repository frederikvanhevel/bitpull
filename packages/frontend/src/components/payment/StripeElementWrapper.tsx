import React, { ReactElement, useState, ElementType } from 'react'
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText
} from '@material-ui/core'
import StripeInput from './StripeInput'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'

interface Props {
    component: ElementType<any>
    label: string
    placeholder?: string
    startAdornment?: ReactElement
    onChange?: (e: any) => void
}

const StripeElementWrapper: React.FC<Props> = ({
    component,
    label,
    placeholder,
    startAdornment,
    onChange
}) => {
    const [focused, setFocused] = useState(false)
    const [empty, setEmpty] = useState(true)
    const [error, setError] = useState<Error>()

    const handleChange = (data: any) => {
        setEmpty(data.empty)
        setError(data.error)

        if (onChange) {
            onChange({
                error: error || empty
            })
        }
    }

    return (
        <div>
            <FormControl fullWidth margin="normal">
                <InputLabel
                    focused={focused}
                    shrink={focused || !empty}
                    error={!!error}
                >
                    {label}
                </InputLabel>
                <Input
                    fullWidth
                    placeholder={placeholder}
                    startAdornment={startAdornment}
                    inputComponent={
                        StripeInput as ElementType<InputBaseComponentProps>
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={handleChange}
                    inputProps={{ component }}
                />
            </FormControl>

            {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
    )
}

export default StripeElementWrapper
