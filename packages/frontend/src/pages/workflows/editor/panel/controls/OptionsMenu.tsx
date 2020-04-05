import React from 'react'
import MoreMenu from 'components/ui/MoreMenu'
import { Delete, Power, PowerOff } from '@material-ui/icons'
import { Node } from 'typedefs/common'

interface Props {
    node: Node
    onRemove: () => void
    onDisable: () => void
}

const OptionsMenu: React.FC<Props> = ({ node, onRemove, onDisable }) => {
    const menuOptions = [
        {
            label: 'Delete',
            icon: <Delete />,
            onClick: () => onRemove()
        },
        {
            label: node.disabled ? 'Enable' : 'Disable',
            icon: node.disabled ? <Power /> : <PowerOff />,
            onClick: () => onDisable()
        }
    ]

    return <MoreMenu options={menuOptions} />
}

export default OptionsMenu
