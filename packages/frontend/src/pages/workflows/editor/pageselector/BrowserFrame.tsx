import React, { useRef, useEffect } from 'react'
import { GET_SITE_CONTENT } from 'queries/workflow'
import { useQuery } from '@apollo/react-hooks'
import { fetchSiteContent } from 'queries/workflow/typedefs/fetchSiteContent'
import Loader from 'components/ui/Loader'
import ErrorScreen from 'components/ui/ErrorScreen'
import { Node } from 'typedefs/common'
import { traverseAncestors } from 'components/node'

interface Props {
    node: Node
    currentSelector?: string
    setSelector: (selector: string) => void
}

const BrowserFrame: React.FC<Props> = ({
    node,
    currentSelector,
    setSelector
}) => {
    const frameRef = useRef() as React.MutableRefObject<HTMLIFrameElement>
    const { data, loading, error } = useQuery<fetchSiteContent>(
        GET_SITE_CONTENT,
        {
            variables: {
                node: traverseAncestors(node)
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
        return (
            <Loader
                delay={225}
                text="Getting website content ..."
                subText="This could take a minute or two"
            />
        )
    if (!data || error)
        return (
            <ErrorScreen
                title="Sorry!"
                description="We couldn't get the website content at this time! Please try again later."
            />
        )

    return (
        <iframe
            srcDoc={data.fetchSiteContent}
            ref={frameRef}
            sandbox="allow-scripts allow-same-origin"
        />
    )
}

export default BrowserFrame
