import React, { useState } from 'react'
import { Node } from 'typedefs/common'
import { makeStyles, Paper } from '@material-ui/core'
import DetailsHeader from './DetailsHeader'
import {
    getEditor,
    isEndNode,
    isIntegrationNode,
    isExportOnlyNode,
    isProcessingOnlyNode,
    getNewNode,
    isPaginationNode
} from './helper'
import SelectProcessor from './controls/SelectProcessor'
import SelectExport from './controls/SelectExport'
import SelectIntegration from './controls/SelectIntegration'
import Tabs from 'components/ui/Tabs'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import StepOverview from './controls/StepOverview'

interface Tab {
    label: string
    disabled: boolean
}

interface Props {
    node: Node
    onClose: () => void
    onDeleteNode: (node: Node) => void
    onUpdateNode: (node: Node) => void
    onReplaceNode: (node: Node) => void
    onSelectNode: (node?: Node) => void
    onAddNode: (node: Node, extraProps?: object) => void
}

const getNextActiveTab = (tabs: Tab[], i: number = 0): number => {
    if (tabs[i].disabled) {
        return getNextActiveTab(tabs, i + 1)
    }

    return i
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        position: 'absolute',
        top: theme.spacing(3),
        left: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        width: '380px',
        maxHeight: 'calc(100% - 50px)',
        marginBottom: theme.spacing(2),
        zIndex: 10
    },
    nodeActions: {
        marginRight: `-${theme.spacing(2)}px`,
        '& button': {
            color: 'white'
        }
    },
    content: {
        flex: '1 1 auto',
        overflowY: 'auto',
        zIndex: 1,
        paddingBottom: theme.spacing(1),
        background: 'white'
    }
}))

const Details: React.FC<Props> = ({
    node,
    onClose,
    onDeleteNode,
    onUpdateNode,
    onReplaceNode,
    onSelectNode,
    onAddNode
}) => {
    const classes = useStyles()
    const [currentTab, setCurrentTab] = useState(0)
    const tabs: Tab[] = [
        { label: 'Next steps', disabled: isExportOnlyNode(node) },
        { label: 'Export data', disabled: isProcessingOnlyNode(node) }
    ]
    const selectedTab = tabs[currentTab].disabled
        ? getNextActiveTab(tabs)
        : currentTab
    const EditorComponent = getEditor(node)
    const onUpdate = (key: string, value: any) => {
        onUpdateNode({
            ...node,
            [key]: value
        })
    }
    const addNewNode = (type: NodeType) =>
        onAddNode({ ...getNewNode(type, node), parent: node })

    return (
        <Paper className={classes.wrapper} elevation={3}>
            <DetailsHeader
                node={node}
                onClose={onClose}
                onDeleteNode={() => onDeleteNode(node)}
                onToggleNode={() =>
                    onUpdate('disabled', node.disabled ? undefined : true)
                }
            />

            <div className={classes.content}>
                <EditorComponent
                    node={node}
                    onUpdate={onUpdate}
                    onReplace={onReplaceNode}
                    onAdd={onAddNode}
                />

                {!isPaginationNode(node) &&
                    !isEndNode(node) &&
                    !isIntegrationNode(node) && (
                        <div>
                            <Tabs
                                tabs={tabs}
                                activeTab={selectedTab}
                                color="primary"
                                onChange={(e, tab) => setCurrentTab(tab)}
                            />

                            {selectedTab === 0 && (
                                <SelectProcessor
                                    node={node}
                                    onAddNode={addNewNode}
                                />
                            )}
                            {selectedTab === 1 && (
                                <SelectExport
                                    node={node}
                                    onAddNode={addNewNode}
                                />
                            )}
                        </div>
                    )}

                {isEndNode(node) && !isIntegrationNode(node) && (
                    <div>
                        <SelectIntegration node={node} onAddNode={addNewNode} />
                    </div>
                )}

                {!isPaginationNode(node) &&
                node.children &&
                node.children.length ? (
                    <StepOverview node={node} onSelectNode={onSelectNode} />
                ) : null}
            </div>
        </Paper>
    )
}

export default Details
