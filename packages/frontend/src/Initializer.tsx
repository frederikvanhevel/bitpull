import React, { Suspense } from 'react'
import Loader from 'components/ui/Loader'

// @ts-ignore
const App = React.lazy(() => import('./App'))

const Initializer: React.FC = () => {
    return (
        <Suspense fallback={<Loader hideText delay={200} fullPage />}>
            <App />
        </Suspense>
    )
}

export default Initializer
