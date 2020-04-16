import React from 'react'
import Logger from 'utils/logger'
import ErrorScreen from 'components/ui/ErrorScreen'
import PaddingWrapper from './PaddingWrapper'

type Props = {
    withPadding?: boolean
}

type State = {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    state: State

    constructor(props: Props) {
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
        const { withPadding } = this.props

        if (this.state.hasError) {
            return withPadding ? (
                <PaddingWrapper withTopbar>
                    <ErrorScreen />
                </PaddingWrapper>
            ) : (
                <ErrorScreen />
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
