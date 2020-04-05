import React from 'react'
import { SvgIcon } from '@material-ui/core'

export const flowChartIconPath =
    'M18.987,16.031C18.991,15.236,19,13.616,19,13.001c0-0.828-0.641-1.938-2-2s-4,0-4,0V8h3.5V3.406h-9V8H11v3c0,0-3.141,0-4,0s-1.969,0.734-1.969,1.969c0,0.881-0.016,2.289-0.024,3.031H1v4.594h9V16H7v-3h10l-0.014,3.031h-3.018v4.594h9v-4.594H18.987z'

const FlowChartIcon: React.FC = () => {
    return (
        <SvgIcon>
            <path d={flowChartIconPath} />
        </SvgIcon>
    )
}

export default FlowChartIcon
