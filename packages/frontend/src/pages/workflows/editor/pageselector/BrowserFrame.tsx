import React, { useRef, useEffect } from 'react'
import { GET_SITE_CONTENT } from 'queries/workflow'
import { useQuery } from '@apollo/react-hooks'
import { fetchSiteContent } from 'queries/workflow/typedefs/fetchSiteContent'
import Loader from 'components/ui/Loader'
import ErrorScreen from 'components/ui/ErrorScreen'
import { Node } from 'typedefs/common'
import { traverseAncestors } from 'components/node'

export interface SelectorPayload {
    selectedItems: number
    prediction: string
}

interface Props {
    node: Node
    payload?: SelectorPayload
    setSelectorPayload: (payload: SelectorPayload) => void
}

const BrowserFrame: React.FC<Props> = ({
    node,
    payload,
    setSelectorPayload
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
            !!event.data?.bitpull
        ) {
            setSelectorPayload(event.data as any)
        }
    }

    useEffect(() => {
        if (!payload) clearSelector()
    }, [payload])

    useEffect(() => {
        window.addEventListener('message', receiveMessage)
        return () => window.removeEventListener('message', receiveMessage)
    }, [])

    if (loading) {
        return (
            <Loader
                delay={225}
                text="Analyzing website ..."
                subText="This could take a minute or two"
            />
        )
    }
    if (!data || error) {
        return (
            <ErrorScreen
                title="Sorry!"
                description="We couldn't get the website content at this time! Please try again later."
            />
        )
    }

    return (
        <iframe
            srcDoc={data.fetchSiteContent}
            ref={frameRef}
            sandbox="allow-scripts allow-same-origin"
        />
    )
}

export default BrowserFrame
