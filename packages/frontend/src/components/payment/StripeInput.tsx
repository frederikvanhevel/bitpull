import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        padding: '6px 0 7px',
        cursor: 'text'
    }
}))

const StripeInput: React.FC<InputBaseComponentProps> = ({
    component: Component,
    onBlur,
    onFocus,
    onChange
}) => {
    const classes = useStyles()
    const theme = useTheme()

    return (
        <Component
            className={classes.root}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(result: any) => {
                // @ts-ignore
                onChange({
                    ...result,
                    target: {
                        value: ''
                    }
                })
            }}
            placeholder=""
            style={{
                base: {
                    fontSize: `${theme.typography.fontSize}px`,
                    fontFamily: theme.typography.fontFamily,
                    color: '#000000de'
                }
            }}
        />
    )
}

export default StripeInput
