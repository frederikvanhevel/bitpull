import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { isLinkDotted } from './helper'
import { Node } from 'typedefs/common'
import SimpleD3FlowChart from './SimpleD3FlowChart'
import { getStyles } from './styles'

interface Props {
    node: Node
}

const useStyles = makeStyles(theme => ({
    svg: {
        flexGrow: 1,
        width: '100%',
        height: '100%'
    },
    ...getStyles(theme)
}))

const SimpleFlowChart: React.FC<Props> = ({ node }) => {
    const classes = useStyles()
    const svgRef = useRef(null)

    useEffect(() => {
        const chart = new SimpleD3FlowChart(
            svgRef.current!,
            classes,
            isLinkDotted
        )
        chart.draw(node)
    }, [])

    return <svg className={classes.svg} ref={svgRef} />
}

export default SimpleFlowChart
