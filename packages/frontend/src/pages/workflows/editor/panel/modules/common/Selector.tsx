import React from 'react'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import SelectorInput from './SelectorInput'
import SelectorButton from './SelectorButton'

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
    buttonLabel?: string
    onUpdate: (selector: HTMLSelector) => void
}

const Selector: React.FC<Props> = ({
    selector = {
        value: '',
        attribute: Attributes.TEXT
    },
    label = 'Selected element',
    buttonLabel,
    withAttribute = true,
    defaultAttribute = Attributes.TEXT,
    node,
    onUpdate
}) => {
    console.log()
    console.log(selector?.value !== '')
    return (
        <>
            {selector && selector.value && selector.value !== '' ? (
                <SelectorInput
                    label={label}
                    selector={selector}
                    node={node}
                    withAttribute={withAttribute}
                    defaultAttribute={defaultAttribute}
                    onUpdate={onUpdate}
                />
            ) : (
                <SelectorButton
                    label={buttonLabel}
                    selector={selector}
                    node={node}
                    onUpdate={onUpdate}
                />
            )}
        </>
    )
}

export default Selector
