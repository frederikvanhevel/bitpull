import React, { Props } from 'react'
import Logger from 'utils/logger'
import ErrorScreen from 'components/ui/ErrorScreen'

type State = {
    hasError: boolean
}

class ErrorBoundary extends React.Component {
    state: State

    constructor(props: Props<any>) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error: Error) {
        Logger.error(error)
    }

    render() {
        if (this.state.hasError) {
            return <ErrorScreen />
        }

        return this.props.children
    }
}

export default ErrorBoundary
