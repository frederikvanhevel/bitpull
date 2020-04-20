import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/react-hooks'
import { getWorkflow } from 'queries/workflow/typedefs/getWorkflow'
import { GET_WORKFLOW, Workflow } from 'queries/workflow'
import { setCurrentWorkflow, createNewWorkflow } from 'actions/workflow'
import Editor from './Editor'
import { AppState } from 'redux/store'
import Loader from 'components/ui/Loader'
import { cancelRunNode } from 'actions/runner'
import ErrorScreen from 'components/ui/ErrorScreen'

const EditorPage: React.FC = () => {
    const { id } = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const currentWorkflow = useSelector<AppState, Workflow | undefined>(
        state => state.workflow.currentWorkflow
    )
    const [loadWorkflow, { data, loading, error }] = useLazyQuery<getWorkflow>(
        GET_WORKFLOW,
        {
            variables: {
                id
            },
            fetchPolicy: 'network-only'
        }
    )

    useEffect(() => {
        if (currentWorkflow && id === currentWorkflow.id) return
        else if (id === 'new') {
            dispatch(createNewWorkflow())
        } else {
            loadWorkflow()
        }
    }, [id, dispatch, loadWorkflow])

    useEffect(() => {
        if (data && data.getWorkflow) {
            dispatch(setCurrentWorkflow(data.getWorkflow))
        }
    }, [data, dispatch])

    useEffect(() => {
        return () => {
            dispatch(cancelRunNode())
        }
    }, [location])

    if (loading) return <Loader />
    if (error) return <ErrorScreen />
    if (currentWorkflow) return <Editor />

    return null
}

export default EditorPage
