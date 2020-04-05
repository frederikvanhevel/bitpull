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
import { ChartClasses } from './helper'
import { ReactNode } from 'react'

export interface ChartOptions {
    classes: ChartClasses
    getNodeClass: (node: Node) => string
    getNodeText: (node: Node) => string
    getNodeIcon: (node: Node) => ReactNode
    onClickNode: (node: Node) => void
    isLinkDotted: (node: Node) => boolean
}

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
        this.nodeGroup = svgGroup.append('g')
    }

    draw(data: Node, sourceNodeId: NodeId) {
        const treeNode = this.d3Tree(hierarchy(data))
        const nodeData = treeNode.descendants()
        const linkData = treeNode.links()
        const sourcePoint = this.findSourcePoint(nodeData, sourceNodeId)

        this.drawNodes(nodeData, sourcePoint)
        this.drawLinks(linkData, sourcePoint)
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
            .attr('marker-mid', 'url(#triangle)')

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

        defs.append('svg:marker')
            .attr('viewBox', '0 0 10 10')
            .attr('id', 'triangle')
            .attr('refX', 6)
            .attr('refY', 6)
            .attr('markerWidth', 30)
            .attr('markerHeight', 30)
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 12 6 0 12 3 6')
            .style('fill', 'black')
    }
}

export default D3FlowChart
