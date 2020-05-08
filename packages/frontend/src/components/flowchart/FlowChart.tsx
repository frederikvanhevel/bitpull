import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Zoomable from './Zoomable'
import { isRootNode, getNodeText, getNodeIcon, isLinkDotted } from './helper'
import { Node } from 'typedefs/common'
import D3FlowChart from './D3FlowChart'
import { isNodeWatchable, isNodeUnreachable } from 'components/node'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { WorkflowState } from 'reducers/workflow'
import usePrevious from 'hooks/usePrevious'
import { getStyles } from './styles'
import { Tooltip } from './typedefs'
import TooltipWrapper from './Tooltip'

interface Props {
    onClickNode: (node: Node) => void
}

const useStyles = makeStyles(theme => ({
    svg: {
        flexGrow: 1,
        width: '100%',
        height: '100%'
    },
    ...getStyles(theme)
}))

const getNodeClass = (
    node: Node,
    workflowState: WorkflowState,
    classes: ReturnType<typeof useStyles>
) => {
    const {
        isSelectingWatcher,
        watchedNodeId,
        selectedNodeId,
        highlightedNodeId,
        activeNodes,
        failedNodes
    } = workflowState
    const classArray = []

    if (failedNodes.includes(node.id)) {
        classArray.push(classes.errorNode)
    } else if (activeNodes.includes(node.id) || highlightedNodeId === node.id) {
        classArray.push(classes.activeNode)
    }

    if (
        (isSelectingWatcher && !isNodeWatchable(node)) ||
        isNodeUnreachable(node)
    ) {
        classArray.push(classes.unreachableNode)
        // classArray.push(classes.unClickable)
        return classArray.join(' ')
    }

    if (isRootNode(node)) {
        classArray.push(classes.primaryNode)
    } else {
        classArray.push(classes.defaultNode)
    }

    if (isNodeUnreachable(node)) {
        classArray.push(classes.unreachableNode)
    }

    if (node.disabled) {
        classArray.push(classes.disabledNode)
    }

    if (selectedNodeId === node.id) {
        classArray.push(classes.selectedNode)
    }

    if (node.id === watchedNodeId) {
        classArray.push(classes.watchedNode)
    }

    return classArray.join(' ')
}

const FlowChart: React.FC<Props> = ({ onClickNode }) => {
    const classes = useStyles()
    const svgRef = useRef(null)
    const chartRef = useRef<D3FlowChart>()
    const workflow = useSelector((state: AppState) => state.workflow)
    const workflowRef = useRef<WorkflowState>(workflow)
    const {
        currentWorkflow,
        watchedNodeId,
        isSelectingWatcher,
        selectedNodeId,
        highlightedNodeId,
        activeNodes,
        failedNodes
    } = workflow
    const { node } = currentWorkflow!
    const previousSelectedNodeId = usePrevious(selectedNodeId)
    const [tooltip, setTooltip] = useState<Tooltip | undefined>()

    useEffect(() => {
        chartRef.current = new D3FlowChart(svgRef.current!, {
            classes,
            getNodeText,
            getNodeClass: currentNode =>
                getNodeClass(currentNode, workflowRef.current, classes),
            getNodeIcon: currentNode =>
                getNodeIcon(currentNode, workflowRef.current.watchedNodeId),
            isLinkDotted,
            onClickNode,
            onShowTooltip: t => setTooltip(t),
            onHideTooltip: () => setTooltip(undefined)
        })
    }, [])

    useEffect(() => {
        workflowRef.current = workflow
        chartRef.current!.draw(node, previousSelectedNodeId || node.id)
    }, [
        node,
        activeNodes,
        failedNodes,
        watchedNodeId,
        isSelectingWatcher,
        selectedNodeId,
        highlightedNodeId
    ])

    return (
        <Zoomable>
            <svg className={classes.svg} ref={svgRef} />
            <TooltipWrapper tooltip={tooltip} />
        </Zoomable>
    )
}

export default FlowChart
