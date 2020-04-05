import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { getWorkflows } from 'queries/workflow/typedefs/getWorkflows'
import { GET_WORKFLOWS } from 'queries/workflow'
import { Select, MenuItem } from '@material-ui/core'

interface Props {
    selectedWorkflow?: string
    onChange: (workflow: string) => void
}

const WorkflowSelect: React.FC<Props> = ({ selectedWorkflow, onChange }) => {
    const { data } = useQuery<getWorkflows>(GET_WORKFLOWS, {
        fetchPolicy: 'cache-and-network'
    })
    const workflows = data?.getWorkflows || []

    return (
        <Select
            value={selectedWorkflow || ''}
            onChange={e => onChange(e.target.value as string)}
        >
            {!workflows.length && (
                <MenuItem disabled>You don't have any workflows yet</MenuItem>
            )}
            {workflows.map(workflow => (
                <MenuItem key={workflow.id} value={workflow.id}>
                    {workflow.name}
                </MenuItem>
            ))}
        </Select>
    )
}

export default WorkflowSelect
