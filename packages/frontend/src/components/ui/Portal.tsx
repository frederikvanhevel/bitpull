import React from 'react'
import { createPortal } from 'react-dom'
import usePortal from './usePortal'

interface Props {
    id: string
}

const Portal: React.FC<Props> = ({ id, children }) => {
    const target = usePortal(id)
    return target ? createPortal(children, target) : null
}

export default Portal
