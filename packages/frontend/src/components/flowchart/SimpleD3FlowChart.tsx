import { select, event } from 'd3-selection'
import { hierarchy, tree } from 'd3-hierarchy'
import {
    HORIZONTAL_SPACING,
    VERTICAL_SPACING,
    SVG_NODE_WIDTH,
    SVG_NODE_HEIGHT
} from './constants'
import { Node } from 'typedefs/common'
import { ChartClasses } from './typedefs'
import { FlowNode } from '@bitpull/worker/lib/typedefs'
import { zoom, zoomIdentity } from 'd3-zoom'

class SimpleD3FlowChart {
    svg: any
    classes: ChartClasses
    isLinkDotted: (node: FlowNode) => boolean
    d3Tree: any
    svgGroup: any
    linkGroup: any
    nodeGroup: any

    constructor(
        svgElement: SVGElement,
        classes: ChartClasses,
        isLinkDotted: (node: FlowNode) => boolean
    ) {
        this.svg = select(svgElement)
        this.classes = classes
        this.isLinkDotted = isLinkDotted

        this.d3Tree = tree().nodeSize([HORIZONTAL_SPACING, VERTICAL_SPACING])

        this.svgGroup = this.svg.select('g').empty()
            ? this.svg.append('g')
            : this.svg.select('g')

        // append groups for links and nodes
        this.linkGroup = this.svgGroup.append('g')
        this.nodeGroup = this.svgGroup.append('g')
    }

    draw(data: Node) {
        const zoomer = zoom()
            .scaleExtent([1, 8])
            .on('zoom', () => {
                this.svgGroup.attr('transform', event.transform)
            })
        const treeNode = this.d3Tree(hierarchy(data))
        const nodeData = treeNode.descendants()
        const linkData = treeNode.links()

        this.drawNodes(nodeData)
        this.drawLinks(linkData)
        this.zoomFit(zoomer, 0.6)
    }

    drawNodes(nodes: any) {
        // select all nodes and merge with data
        this.nodeGroup
            .selectAll(`g.${this.classes.node}`)
            .data(nodes, (d: any) => d.data.id)
            .enter()
            .append('g')
            .attr('pointer-events', 'none')
            .attr('id', (d: any) => d.data.id)
            .attr('class', () => {
                const classArray = [this.classes.node, this.classes.defaultNode]
                return classArray.join(' ')
            })
            .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
            .append('rect') // add node blocks
            .attr('width', SVG_NODE_WIDTH)
            .attr('height', SVG_NODE_HEIGHT)
            .attr('x', -SVG_NODE_WIDTH / 2)
            .attr('y', -SVG_NODE_HEIGHT / 2)
    }

    drawLinks(links: any) {
        // select all links and merge with data
        this.linkGroup
            .selectAll(`path.${this.classes.link}`)
            .data(links, (d: any) => `${d.source.data.id}${d.target.data.id}`)
            .enter()
            .append('path')
            .attr('pointer-events', 'none')
            .attr('class', this.classes.link)
            .attr('d', (d: any) => this.updateLinkPath(d))
            .style('stroke-dasharray', (d: any) => {
                return this.isLinkDotted(d) ? '5, 4' : '0, 0'
            })
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

    zoomFit(zoomer: any, paddingPercent?: number) {
        var bounds = this.svgGroup.node().getBBox()
        var parent = this.svgGroup.node().parentElement
        var fullWidth = parent.clientWidth,
            fullHeight = parent.clientHeight
        var width = bounds.width,
            height = bounds.height
        var midX = bounds.x + width / 2,
            midY = bounds.y + height / 2
        if (width === 0 || height === 0) return // nothing to fit
        var scale =
            (paddingPercent || 0.75) /
            Math.max(width / fullWidth, height / fullHeight)
        var translate = [
            fullWidth / 2 - scale * midX,
            fullHeight / 2 - scale * midY
        ]

        var transform = zoomIdentity
            .translate(translate[0], translate[1])
            .scale(scale)

        this.svgGroup.call(zoomer.transform, transform)
    }
}

export default SimpleD3FlowChart
