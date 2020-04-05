import React, { useState, useEffect, useRef } from 'react'
import FlowChart from 'components/flowchart/FlowChart'
import { Node } from 'typedefs/common'
import WorkArea from 'components/ui/WorkArea'
import Details from './panel/Details'
import Controls from './controls/TopControls'
import { useDispatch, useSelector } from 'react-redux'
import {
    updateNode,
    deleteNode,
    setSelectedNodeId,
    setWatchedNodeId,
    toggleWatcherSelect
} from 'actions/workflow'
import BottomControls from './controls/BottomControls'
import { AppState } from 'redux/store'
import { Prompt } from 'react-router-dom'
import { WorkflowState } from 'reducers/workflow'
import PageTitle from 'components/navigation/PageTitle'

const Editor: React.FC = () => {
    const dispatch = useDispatch()
    const [selectedNode, setSelectedNode] = useState<Node>()
    const {
        isSelectingWatcher,
        hasUnsavedChanges,
        currentWorkflow
    } = useSelector<AppState, WorkflowState>(state => state.workflow)
    const watchSelectRef = useRef(isSelectingWatcher)
    const onUpdateNode = (node: Node) => {
        dispatch(updateNode(node))
        setSelectedNode(node)
    }
    const onDeleteNode = (node: Node) => {
        dispatch(deleteNode(node))
        setSelectedNode(undefined)
    }
    const onSelectNode = (node?: Node) => {
        dispatch(setSelectedNodeId(node ? node.id : undefined))
        setSelectedNode(node)
    }
    const onAddNode = (node: Node, extraProps: object = {}) => {
        if (!selectedNode) return

        onUpdateNode({
            ...selectedNode,
            ...extraProps,
            children: selectedNode.children
                ? [...selectedNode.children, node]
                : [node]
        })

        setSelectedNode(node)
        dispatch(setSelectedNodeId(node.id))
    }

    useEffect(() => {
        watchSelectRef.current = isSelectingWatcher
        return () => {
            dispatch(setSelectedNodeId(undefined))
        }
    }, [isSelectingWatcher])

    return (
        <>
            <PageTitle>
                {currentWorkflow?.name.length
                    ? currentWorkflow.name
                    : 'Workflow editor'}{' '}
                - BitPull
            </PageTitle>

            <Controls />

            <WorkArea>
                {selectedNode && (
                    <Details
                        node={selectedNode}
                        onClose={() => {
                            setSelectedNode(undefined)
                            onSelectNode(undefined)
                        }}
                        onDeleteNode={onDeleteNode}
                        onUpdateNode={onUpdateNode}
                        onSelectNode={onSelectNode}
                        onAddNode={onAddNode}
                    />
                )}

                <FlowChart
                    onClickNode={(clickedNode: Node) => {
                        if (watchSelectRef.current) {
                            dispatch(setWatchedNodeId(clickedNode.id))
                            dispatch(toggleWatcherSelect())
                        } else {
                            setSelectedNode(clickedNode)
                            onSelectNode(clickedNode)
                        }
                    }}
                />

                <BottomControls />

                <Prompt
                    when={hasUnsavedChanges}
                    message={location =>
                        location.pathname.startsWith('/workflow/')
                            ? true
                            : 'Are you sure you want to leave? You have unsaved changes.'
                    }
                />
            </WorkArea>
        </>
    )
}

export default Editor
