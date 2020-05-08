import { select } from 'd3-selection'
import { hierarchy, tree } from 'd3-hierarchy'
import {
    HORIZONTAL_SPACING,
    VERTICAL_SPACING,
    SVG_NODE_WIDTH,
    SVG_NODE_HEIGHT,
    ANIMATION_SPEED,
    ICON_SIZE,
    SVG_NODE_PADDING
} from './constants'
import { NodeId } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { isBranchLink, getTooltipType } from './helper'
import { getMarker } from './helper'
import { ChartOptions } from './typedefs'

class D3FlowChart {
    svg: any
    options: ChartOptions
    d3Tree: any
    linkGroup: any
    nodeGroup: any
    markerGroup: any

    constructor(svgElement: SVGElement, options: ChartOptions) {
        this.svg = select(svgElement)
        this.options = options

        this.d3Tree = tree().nodeSize([HORIZONTAL_SPACING, VERTICAL_SPACING])

        const svgGroup = this.svg.select('g').empty()
            ? this.svg.append('g')
            : this.svg.select('g')

        this.addFilterForBoxShadow()

        // append groups for links and nodes
        this.linkGroup = svgGroup.append('g')
        this.markerGroup = svgGroup.append('g')
        this.nodeGroup = svgGroup.append('g')
    }

    draw(data: Node, sourceNodeId: NodeId) {
        const treeNode = this.d3Tree(hierarchy(data))
        const nodeData = treeNode.descendants()
        const linkData = treeNode.links()
        const sourcePoint = this.findSourcePoint(nodeData, sourceNodeId)

        this.drawNodes(nodeData, sourcePoint)
        this.drawLinks(linkData, sourcePoint)
        this.drawMarkers(linkData, sourcePoint)
    }

    drawNodes(nodes: any, sourcePoint: any) {
        const {
            classes,
            getNodeClass,
            getNodeText,
            getNodeIcon,
            onClickNode
        } = this.options

        // select all nodes and merge with data
        const allNodes = this.nodeGroup
            .selectAll(`g.${classes.node}`)
            .data(nodes, (d: any) => d.data.id)

        // add new g elements and position nodes sourcePoint
        const newNodes = allNodes.enter().append('g')

        newNodes
            .attr('id', (d: any) => d.data.id)
            .attr('pointer-events', 'none')
            .attr(
                'transform',
                () => `translate(${sourcePoint.x0}, ${sourcePoint.y0})`
            )

        // add rectangle for each node
        newNodes
            .append('rect') // add node blocks
            .attr('width', SVG_NODE_WIDTH)
            .attr('height', SVG_NODE_HEIGHT)
            .attr('x', -SVG_NODE_WIDTH / 2)
            .attr('y', -SVG_NODE_HEIGHT / 2)
            .attr('pointer-events', 'visible')

        // add text anchor
        newNodes
            .append('text')
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .style('user-select', 'none')

        // add path for icons
        newNodes
            .append('path')
            .attr('d', () => null)
            .attr(
                'transform',
                () =>
                    `translate(${0 - SVG_NODE_WIDTH / 2 + SVG_NODE_PADDING}, ${
                        0 - SVG_NODE_HEIGHT / 2 + SVG_NODE_PADDING
                    })`
            )

        const updatedNodes = newNodes.merge(allNodes)

        updatedNodes
            .transition()
            .duration(ANIMATION_SPEED)
            .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)

        // update styles
        updatedNodes.attr('class', (d: any) => {
            const classArray = [classes.node, getNodeClass(d.data)]
            return classArray.join(' ')
        })

        // update icons
        updatedNodes.select('path').attr('d', (d: any) => {
            return getNodeIcon(d.data) || null
        })

        // update text
        updatedNodes
            .select('text')
            .text((d: any) => getNodeText(d.data))
            .attr('width', (d: any) => {
                const iconSize = d.data.icon ? ICON_SIZE + SVG_NODE_PADDING : 0
                return SVG_NODE_WIDTH - SVG_NODE_PADDING * 2 - iconSize
            })
            .attr('transform', (d: any) => {
                const iconSize = d.data.icon ? ICON_SIZE / 2 : 0
                return `translate(${0 + iconSize + SVG_NODE_PADDING}, 0)`
            })
            .each(this.textWrap)

        updatedNodes.on('click', (d: any) => {
            onClickNode(d.data)
        })

        // remove deleted nodes from tree
        allNodes.exit().remove()
    }

    drawLinks(links: any, sourcePoint: any) {
        const { classes, isLinkDotted } = this.options

        // select all links and merge with data
        const allLinks = this.linkGroup
            .selectAll(`path.${classes.link}`)
            .data(links, (d: any) => `${d.source.data.id}${d.target.data.id}`)

        // add path to link tree nodes
        const newSvgLinks = allLinks
            .enter()
            .append('path')
            .attr('class', classes.link)
            .attr('d', () => {
                const x = sourcePoint.x0
                const y = sourcePoint.y0

                // links are just dots when entered
                // they are then transitioned to correct positions later as part of the animation
                return `M${x} ${y}C${x} ${y}, ${x} ${y}, ${x} ${y}`
            })

        const updatedSvgLinks = newSvgLinks.merge(allLinks)

        // transition links to correct positions
        updatedSvgLinks
            .transition()
            .duration(ANIMATION_SPEED)
            .attr('d', (d: any) => this.updateLinkPath(d))
            .style('stroke-dasharray', (d: any) => {
                return isLinkDotted(d) ? '5, 4' : '0, 0'
            })

        allLinks.exit().remove()
    }

    drawMarkers(links: any, sourcePoint: any) {
        const { classes, onShowTooltip, onHideTooltip } = this.options

        // select all links and merge with data
        const allMarkers = this.markerGroup
            .selectAll(`g.${classes.marker}`)
            .data(
                links.filter(isBranchLink),
                (d: any) => `${d.source.data.id}${d.target.data.id}`
            )

        // add path to link tree nodes
        const newMarkers = allMarkers
            .enter()
            .append('g')
            .attr('class', classes.marker)
            .attr('transform', () => {
                return `translate(${sourcePoint.x0}, ${sourcePoint.y0})`
            })
            .on('mouseover', function (d: any) {
                // @ts-ignore
                const bbox = this.getBoundingClientRect()
                const cx = bbox.x + bbox.width
                const cy = bbox.y + bbox.height / 2

                onShowTooltip({
                    type: getTooltipType(d),
                    position: { x: cx, y: cy }
                })
            })
            .on('mouseout', function () {
                onHideTooltip()
            })

        newMarkers
            .append('circle')
            .attr('r', 10)
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('fill', 'white')
            .attr('stroke', '#9e9e9e')
            .attr('stroke-width', 2)
            .attr('transform', () => `translate(-10, -10)`)

        // add path for icons
        newMarkers
            .append('path')
            .attr('d', () => null)
            .attr('transform', () => `translate(-12, -12)`)

        const updatedMarkers = newMarkers.merge(allMarkers)

        // transition links to correct positions
        updatedMarkers
            .transition()
            .duration(ANIMATION_SPEED)
            .attr('transform', (d: any) => {
                const midX = d.source.x + (d.target.x - d.source.x) * 0.5
                const midY = d.source.y + (d.target.y - d.source.y) * 0.5
                return `translate(${midX}, ${midY})`
            })

        // update icons
        updatedMarkers.select('path').attr('d', (d: any) => {
            return getMarker(d) || null
        })

        allMarkers.exit().remove()
    }

    updateLinkPath(d: any, target: any = {}, source: any = {}) {
        const sourceX = source.x || d.source.x
        const sourceY = (source.y || d.source.y) + SVG_NODE_HEIGHT / 2
        let targetX = target.x || d.target.x
        let targetY = (target.y || d.target.y) - SVG_NODE_HEIGHT / 2

        // target is in the same or previous level
        if (targetY <= sourceY) {
            targetY = target.y || d.target.y

            if (targetX <= sourceX) {
                // target is on the left side of this node
                targetX += SVG_NODE_WIDTH / 2
            } else {
                targetX -= SVG_NODE_WIDTH / 2
            }
            return `M${sourceX} ${sourceY}C${sourceX} ${
                sourceY + SVG_NODE_HEIGHT
            }, ${
                Math.max(sourceX, targetX) - Math.abs(sourceX - targetX) / 2
            } ${targetY}, ${targetX} ${targetY}`
        }

        return `M${sourceX} ${sourceY}C${sourceX} ${
            (sourceY + targetY) / 2
        }, ${targetX} ${(sourceY + targetY) / 2}, ${targetX} ${targetY}`
    }

    textWrap() {
        const self = select(this as any)

        let textLength = (self.node() as any).getComputedTextLength()
        let text = self.text().slice(0, 15)

        while (
            textLength > (self.attr('width') as any) - ICON_SIZE &&
            text.length > 0
        ) {
            text = text.slice(0, -2)
            self.text(`${text}...`)
            textLength = (self.node() as any).getComputedTextLength()
        }
    }

    findSourcePoint(nodes: any, sourceNodeId: NodeId) {
        let sourcePoint = { x: 0, x0: 0, y: 0, y0: 0 }

        if (sourceNodeId) {
            const sourceNode =
                nodes.filter((d: any) => d.data.id === sourceNodeId) || []

            if (sourceNode.length) {
                sourcePoint = {
                    x: sourceNode[0].x,
                    x0: sourceNode[0].x,
                    y: sourceNode[0].y,
                    y0: sourceNode[0].y
                }
            }
        }

        return sourcePoint
    }

    addFilterForBoxShadow() {
        const defs = this.svg.append('defs')

        const filter = defs
            .append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '130%')

        filter
            .append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'blur')

        filter
            .append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 1)
            .attr('dy', 2)
            .attr('result', 'offsetBlur')

        const feMerge = filter.append('feMerge')

        feMerge.append('feMergeNode').attr('in', 'offsetBlur')
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
    }
}

export default D3FlowChart
