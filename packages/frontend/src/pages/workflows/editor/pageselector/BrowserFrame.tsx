import React, { useRef, useEffect } from 'react'
import { GET_SITE_CONTENT } from 'queries/workflow'
import { useQuery } from '@apollo/react-hooks'
import { fetchSiteContent } from 'queries/workflow/typedefs/fetchSiteContent'
import Loader from 'components/ui/Loader'
import ErrorScreen from 'components/ui/ErrorScreen'

interface Props {
    url: string
    currentSelector?: string
    setSelector: (selector: string) => void
}

const BrowserFrame: React.FC<Props> = ({
    url,
    currentSelector,
    setSelector
}) => {
    const frameRef = useRef() as React.MutableRefObject<HTMLIFrameElement>
    const { data, loading, error } = useQuery<fetchSiteContent>(
        GET_SITE_CONTENT,
        {
            variables: {
                url
            }
        }
    )
    const postMessage = (message: string) => {
        if (!frameRef.current) return
        frameRef.current.contentWindow!.postMessage(message, '*')
    }
    const clearSelector = () => {
        postMessage('clear_selector')
    }
    const receiveMessage = (event: MessageEvent) => {
        if (
            event.origin === document.location.origin &&
            typeof event.data === 'string'
        ) {
            setSelector(event.data)
        }
    }

    useEffect(() => {
        if (!currentSelector) clearSelector()
    }, [currentSelector])

    useEffect(() => {
        window.addEventListener('message', receiveMessage)
        return () => window.removeEventListener('message', receiveMessage)
    }, [])

    if (loading)
        return <Loader delay={225} text="Getting website contents ..." />
    if (!data || error) return <ErrorScreen />

    return <iframe srcDoc={data.fetchSiteContent} ref={frameRef} />
}

export default BrowserFrame
