import React, { useState } from 'react'
import format from 'date-fns/format'
import { useQuery } from '@apollo/react-hooks'
import { getWorkflows } from 'queries/workflow/typedefs/getWorkflows'
import { GET_WORKFLOWS } from 'queries/workflow'
import Toolbar from 'components/navigation/Toolbar'
import {
    Button,
    Paper,
    ListItem,
    Typography,
    List,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import DeleteIcon from '@material-ui/icons/Delete'
// import CopyIcon from '@material-ui/icons/FileCopy'
import { Link, useHistory } from 'react-router-dom'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import Loader from 'components/ui/Loader'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { removeWorkflow } from 'mutations/workflow'
import ErrorScreen from 'components/ui/ErrorScreen'
import { getError } from 'utils/errors'
import PageTitle from 'components/navigation/PageTitle'
import StaticImage from 'components/ui/StaticImage'
import noDataImage from 'components/ui/icons/no-data.svg'

const WorkflowListPage: React.FC = () => {
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const [workflowToDelete, setWorkflowToDelete] = useState<string>()
    const { data, loading, error } = useQuery<getWorkflows>(GET_WORKFLOWS, {
        fetchPolicy: 'cache-and-network'
    })
    const workflows = data ? data.getWorkflows : []

    const onRemove = async () => {
        try {
            setWorkflowToDelete(undefined)
            await removeWorkflow(workflowToDelete!)
        } catch (err) {
            enqueueSnackbar(getError(err), {
                variant: 'error'
            })
        }
    }

    if (error) return <ErrorScreen />
    if (!data && loading) return <Loader />

    return (
        <>
            <PageTitle>Workflows - BitPull</PageTitle>

            <Toolbar>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component={Link}
                    to="/workflow/new"
                >
                    New workflow
                </Button>
            </Toolbar>

            <PaddingWrapper withTopbar>
                <Paper>
                    {!workflows.length ? (
                        <ListItem>
                            <StaticImage image={noDataImage}>
                                <Typography variant="body2">
                                    You haven&lsquo;t created any workflows yet.{' '}
                                    <Link to="/workflow/new">
                                        Create one now
                                    </Link>
                                </Typography>
                            </StaticImage>
                        </ListItem>
                    ) : null}

                    {workflows.length ? (
                        <List>
                            {workflows.map(workflow => (
                                <ListItem
                                    button
                                    key={workflow.id}
                                    onClick={() =>
                                        history.push(`/workflow/${workflow.id}`)
                                    }
                                >
                                    <ListItemText
                                        primary={workflow.name}
                                        secondary={`Last modified ${format(
                                            new Date(workflow.updatedAt),
                                            'MMM d, ha'
                                        )}`}
                                    />
                                    <ListItemSecondaryAction>
                                        {/* <IconButton
                                        onClick={() =>
                                            duplicateWorkflow(workflow.id)
                                        }
                                        >
                                            <CopyIcon />
                                        </IconButton> */}
                                        <IconButton
                                            onClick={() =>
                                                setWorkflowToDelete(workflow.id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : null}
                </Paper>
            </PaddingWrapper>

            <ConfirmDialog
                title="Are you sure?"
                onClose={() => setWorkflowToDelete(undefined)}
                onConfirm={onRemove}
                open={!!workflowToDelete}
            >
                You cannot undo this action
            </ConfirmDialog>
        </>
    )
}

export default WorkflowListPage
