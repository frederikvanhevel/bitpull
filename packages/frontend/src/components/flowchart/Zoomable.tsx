import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { makeStyles, Paper, Button } from '@material-ui/core'
import { ZoomOut, ZoomIn } from '@material-ui/icons'

interface Props {
    scaleExtent?: [number, number]
    defaultZoom?: number
    zoomFactor?: number
}

const useStyles = makeStyles(theme => ({
    containerDiv: {
        position: 'relative',
        height: '100%'
    },
    buttonDiv: {
        position: 'absolute',
        top: theme.spacing(3),
        right: theme.spacing(3)
    },
    button: {
        fontSize: '22px'
    },
    grab: {
        cursor: 'grab'
    },
    grabbing: {
        cursor: 'grabbing'
    }
}))

const Zoomable: React.FC<Props> = ({
    children,
    scaleExtent = [0.2, 3],
    defaultZoom = 0.8,
    zoomFactor = 0.2
}) => {
    const classes = useStyles()
    const [hasValidSvg, setValidSvg] = useState(false)
    const ref = useRef(null)
    const svg = useRef<any>()
    const zoom = useRef<any>()

    useEffect(() => {
        svg.current = d3.select(ref.current).select(`svg`)
        svg.current.classed(classes.grab, true)

        if (!svg.current.empty()) setValidSvg(true)

        const svgGroup = svg.current.append('g')
        const size = (svg.current.node() as any).getBoundingClientRect()

        zoom.current = d3
            .zoom()
            .scaleExtent(scaleExtent)
            .on('zoom', () => svgGroup.attr('transform', d3.event.transform))
            .on('start', () => svg.current.classed(classes.grabbing, true))
            .on('end', () => svg.current.classed(classes.grabbing, false))

        svg.current
            .call(zoom.current)
            .call(zoom.current.translateTo, 0, size.height / 2) // set initial position
            .call(zoom.current.scaleTo, defaultZoom)
            .on('dblclick.zoom', null)
    }, [])

    const zoomIn = () => svg.current.call(zoom.current.scaleBy, 1 + zoomFactor)
    const zoomOut = () => svg.current.call(zoom.current.scaleBy, 1 - zoomFactor)

    return (
        <div className={classes.containerDiv} ref={ref}>
            {children}

            {hasValidSvg && (
                <Paper className={classes.buttonDiv}>
                    <Button className={classes.button} onClick={zoomOut}>
                        <ZoomOut />
                    </Button>
                    <Button className={classes.button} onClick={zoomIn}>
                        <ZoomIn />
                    </Button>
                </Paper>
            )}
        </div>
    )
}

export default Zoomable
