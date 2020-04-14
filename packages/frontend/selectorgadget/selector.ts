import * as jQuery from 'jquery/dist/jquery.slim'
import DomPredictionHelper from './dom-prediction'

import './selector.css'

class SelectorGadget {
    constructor() {
        this.borderWidth = 5
        this.borderPadding = 2
        this.borderTop = null
        this.borderLeft = null
        this.borderRight = null
        this.borderBottom = null
        this.selected = []
        this.rejected = []
        this.specialMode = null
        this.pathOutputField = null
        this.selectorDiv = null
        this.ignoreClass = 'selectorgadget_ignore'
        this.unbound = false
        this.predictionHelper = new DomPredictionHelper()
        this.restrictedElements = jQuery.map(
            ['html', 'body', 'head', 'base'],
            selector => jQuery(selector).get(0)
        )

        window.addEventListener('message', this.receiveMessage, false)
    }

    receiveMessage = event => {
        if (typeof event.data === 'string' && event.data === 'clear_selector') {
            this.clearEverything()
        }
    }

    makeBorders(originalElement, makeRed) {
        let pathToShow
        this.removeBorders()
        this.setupBorders()

        if (originalElement.parentNode) {
            pathToShow = `${originalElement.parentNode.tagName.toLowerCase()} ${originalElement.tagName.toLowerCase()}`
        } else {
            pathToShow = originalElement.tagName.toLowerCase()
        }

        const elem = jQuery(originalElement)
        const p = elem.offset()

        const { top } = p
        const { left } = p
        const width = elem.outerWidth()
        const height = elem.outerHeight()

        this.borderTop
            .css(
                'width',
                this.px(width + this.borderPadding * 2 + this.borderWidth * 2)
            )
            .css('top', this.px(top - this.borderWidth - this.borderPadding))
            .css('left', this.px(left - this.borderPadding - this.borderWidth))
        this.borderBottom
            .css(
                'width',
                this.px(
                    width + this.borderPadding * 2 + this.borderWidth * 2 - 5
                )
            )
            .css('top', this.px(top + height + this.borderPadding))
            .css('left', this.px(left - this.borderPadding - this.borderWidth))
            .text(pathToShow)
        this.borderLeft
            .css('height', this.px(height + this.borderPadding * 2))
            .css('top', this.px(top - this.borderPadding))
            .css('left', this.px(left - this.borderPadding - this.borderWidth))
        this.borderRight
            .css('height', this.px(height + this.borderPadding * 2))
            .css('top', this.px(top - this.borderPadding))
            .css('left', this.px(left + width + this.borderPadding))

        this.borderRight.get(0).target_elem = this.borderLeft.get(
            0
        ).target_elem = this.borderTop.get(
            0
        ).target_elem = this.borderBottom.get(0).target_elem = originalElement

        if (
            makeRed ||
            elem.hasClass('selectorgadget_suggested') ||
            elem.hasClass('selectorgadget_selected')
        ) {
            this.borderTop.addClass('selectorgadget_border_red')
            this.borderBottom.addClass('selectorgadget_border_red')
            this.borderLeft.addClass('selectorgadget_border_red')
            this.borderRight.addClass('selectorgadget_border_red')
        } else {
            if (this.borderTop.hasClass('selectorgadget_border_red')) {
                this.borderTop.removeClass('selectorgadget_border_red')
                this.borderBottom.removeClass('selectorgadget_border_red')
                this.borderLeft.removeClass('selectorgadget_border_red')
                this.borderRight.removeClass('selectorgadget_border_red')
            }
        }

        return this.showBorders()
    }

    px(p) {
        return `${p}px`
    }

    showBorders() {
        this.borderTop.show()
        this.borderBottom.show()
        this.borderLeft.show()
        return this.borderRight.show()
    }

    removeBorders() {
        if (this.borderTop) {
            this.borderTop.hide()
            this.borderBottom.hide()
            this.borderLeft.hide()
            return this.borderRight.hide()
        }
    }

    setupBorders() {
        if (!this.borderTop) {
            const width = `${this.borderWidth}px`
            this.borderTop = jQuery('<div>')
                .addClass('selectorgadget_border')
                .css('height', width)
                .hide()
                .bind('mousedown.sg', { self: this }, this.sgMousedown)
            this.borderBottom = jQuery('<div>')
                .addClass('selectorgadget_border')
                .addClass('selectorgadget_bottom_border')
                .css('height', this.px(this.borderWidth + 6))
                .hide()
                .bind('mousedown.sg', { self: this }, this.sgMousedown)
            this.borderLeft = jQuery('<div>')
                .addClass('selectorgadget_border')
                .css('width', width)
                .hide()
                .bind('mousedown.sg', { self: this }, this.sgMousedown)
            this.borderRight = jQuery('<div>')
                .addClass('selectorgadget_border')
                .css('width', width)
                .hide()
                .bind('mousedown.sg', { self: this }, this.sgMousedown)
            return this.addBorderToDom()
        }
    }

    addBorderToDom() {
        document.body.appendChild(this.borderTop.get(0))
        document.body.appendChild(this.borderBottom.get(0))
        document.body.appendChild(this.borderLeft.get(0))
        return document.body.appendChild(this.borderRight.get(0))
    }

    removeBorderFromDom() {
        if (this.borderTop) {
            this.borderTop.remove()
            this.borderBottom.remove()
            this.borderLeft.remove()
            this.borderRight.remove()
            return (this.borderTop = this.borderBottom = this.borderLeft = this.borderRight = null)
        }
    }

    selectable(elem) {
        return (
            !this.css_restriction ||
            (this.css_restriction && jQuery(elem).is(this.css_restriction))
        )
    }

    sgMouseover(e) {
        const gadget = e.data.self
        if (gadget.unbound) {
            return true
        }
        if (this === document.body || this === document.body.parentNode) {
            return false
        }
        const self = jQuery(this)

        gadget.unhighlightIframes()
        if (self.is('iframe')) {
            gadget.highlightIframe(self, e)
        }

        if (gadget.specialMode !== 'd') {
            // Jump to any the first selected parent of this node.
            const parent = gadget.firstSelectedOrSuggestedParent(this)
            if (
                parent !== null &&
                parent !== this &&
                gadget.selectable(parent)
            ) {
                gadget.makeBorders(parent, true)
            } else {
                if (gadget.selectable(self)) {
                    gadget.makeBorders(this)
                }
            }
        } else {
            if (!jQuery('.selectorgadget_selected', this).get(0)) {
                if (gadget.selectable(self)) {
                    gadget.makeBorders(this)
                }
            }
        }
        return false
    }

    firstSelectedOrSuggestedParent(elem) {
        const orig = elem
        if (
            jQuery(elem).hasClass('selectorgadget_suggested') ||
            jQuery(elem).hasClass('selectorgadget_selected')
        ) {
            return elem
        }
        while (elem.parentNode && (elem = elem.parentNode)) {
            if (jQuery.inArray(elem, this.restrictedElements) === -1) {
                if (
                    jQuery(elem).hasClass('selectorgadget_suggested') ||
                    jQuery(elem).hasClass('selectorgadget_selected')
                ) {
                    return elem
                }
            }
        }
        return null
    }

    sgMouseout(e) {
        const gadget = e.data.self
        if (gadget.unbound) {
            return true
        }
        if (this === document.body || this === document.body.parentNode) {
            return false
        }
        const elem = jQuery(this)
        gadget.removeBorders()
        return false
    }

    highlightIframe(elem, click) {
        const p = elem.offset()
        const self = this
        const target = jQuery(click.target)
        const block = jQuery('<div>')
            .css('position', 'absolute')
            .css('z-index', '99998')
            .css('width', this.px(elem.outerWidth()))
            .css('height', this.px(elem.outerHeight()))
            .css('top', this.px(p.top))
            .css('left', this.px(p.left))
            .css('background-color', '#AAA')
            .css('opacity', '0.6')
            .addClass('selectorgadget_iframe')
            .addClass('selectorgadget_clean')

        const instructions = jQuery(
            '<div><span>This is an iframe.  To select in it, </span></div>'
        )
            .addClass('selectorgadget_iframe_info')
            .addClass('selectorgadget_iframe')
            .addClass('selectorgadget_clean')
        instructions.css(
            { width: '200px', border: '1px solid #888' },
            {
                padding: '5px',
                'background-color': 'white',
                position: 'absolute',
                'z-index': '99999',
                top: this.px(p.top + elem.outerHeight() / 4.0),
                left: this.px(p.left + (elem.outerWidth() - 200) / 2.0),
                height: '150px'
            }
        )

        let src = null
        try {
            src = elem.contents().get(0).location.href
        } catch (e) {
            src = elem.attr('src')
        }
        instructions.append(
            jQuery("<a target='_top'>click here to open it</a>").attr(
                'href',
                src
            )
        )
        instructions.append(
            jQuery('<span>, then relaunch SelectorGadget.</span>')
        )
        document.body.appendChild(instructions.get(0))
        block.click(function() {
            // console.log(target)
            if (self.selectable(target)) {
                return target.mousedown()
            }
        })
        return document.body.appendChild(block.get(0))
    }

    unhighlightIframes(elem, click) {
        return jQuery('.selectorgadget_iframe').remove()
    }

    sgMousedown(e) {
        const gadget = e.data.self
        if (gadget.unbound) {
            return true
        }
        let elem = this
        let w_elem = jQuery(elem)

        if (w_elem.hasClass('selectorgadget_border')) {
            // They have clicked on one of our floating borders, target the element that we are bordering.
            elem = elem.target_elem || elem
            w_elem = jQuery(elem)
        }

        if (elem === document.body || elem === document.body.parentNode) {
            return
        }

        if (gadget.specialMode !== 'd') {
            const potential_elem = gadget.firstSelectedOrSuggestedParent(elem)
            if (potential_elem !== null && potential_elem !== elem) {
                elem = potential_elem
                w_elem = jQuery(elem)
            }
        } else {
            if (jQuery('.selectorgadget_selected', this).get(0)) {
                gadget.blockClicksOn(elem)
            } // Don't allow selection of elements that have a selected child.
        }

        if (!gadget.selectable(w_elem)) {
            gadget.removeBorders()
            gadget.blockClicksOn(elem)
            return false
        }

        if (w_elem.hasClass('selectorgadget_selected')) {
            w_elem.removeClass('selectorgadget_selected')
            gadget.selected.splice(jQuery.inArray(elem, gadget.selected), 1)
        } else if (w_elem.hasClass('selectorgadget_rejected')) {
            w_elem.removeClass('selectorgadget_rejected')
            gadget.rejected.splice(jQuery.inArray(elem, gadget.rejected), 1)
        } else if (w_elem.hasClass('selectorgadget_suggested')) {
            w_elem.addClass('selectorgadget_rejected')
            gadget.rejected.push(elem)
        } else {
            w_elem.addClass('selectorgadget_selected')
            gadget.selected.push(elem)
        }

        gadget.clearSuggested()
        const prediction = gadget.predictionHelper.predictCss(
            jQuery(gadget.selected),
            jQuery(gadget.rejected.concat(gadget.restrictedElements))
        )
        gadget.suggestPredicted(prediction)
        gadget.setPath(prediction)

        gadget.removeBorders()
        gadget.blockClicksOn(elem)
        w_elem.trigger('mouseover.sg', { self: gadget }) //  Refresh the borders by triggering a new mouseover event.

        return false
    }

    setupEventHandlers() {
        jQuery('*:not(.selectorgadget_ignore)').bind(
            'mouseover.sg',
            { self: this },
            this.sgMouseover
        )
        jQuery('*:not(.selectorgadget_ignore)').bind(
            'mouseout.sg',
            { self: this },
            this.sgMouseout
        )
        jQuery('*:not(.selectorgadget_ignore)').bind(
            'mousedown.sg',
            { self: this },
            this.sgMousedown
        )
        jQuery('html').bind(
            'keydown.sg',
            { self: this },
            this.listenForActionKeys
        )
        return jQuery('html').bind(
            'keyup.sg',
            { self: this },
            this.clearActionKeys
        )
    }

    // The only action key right now is shift, which snaps to any div that has been selected.
    listenForActionKeys(e) {
        const gadget = e.data.self
        if (gadget.unbound) {
            return true
        }
        if (e.keyCode === 16 || e.keyCode === 68) {
            // shift or d
            gadget.specialMode = 'd'
            return gadget.removeBorders()
        }
    }

    clearActionKeys(e) {
        const gadget = e.data.self
        if (gadget.unbound) {
            return true
        }
        gadget.removeBorders()
        return (gadget.specialMode = null)
    }

    // Block clicks for a moment by covering this element with a div.  Eww?
    blockClicksOn(elem) {
        elem = jQuery(elem)
        const p = elem.offset()
        const block = jQuery('<div>')
            .css('position', 'absolute')
            .css('z-index', '9999999')
            .css('width', this.px(elem.outerWidth()))
            .css('height', this.px(elem.outerHeight()))
            .css('top', this.px(p.top))
            .css('left', this.px(p.left))
            .css('background-color', '')
        document.body.appendChild(block.get(0))
        setTimeout(() => block.remove(), 400)
        return false
    }

    setMode(mode) {
        if (mode === 'browse') {
            this.removeEventHandlers()
        } else if (mode === 'interactive') {
            this.setupEventHandlers()
        }
        return this.clearSelected()
    }

    suggestPredicted(prediction) {
        if (prediction && prediction !== '') {
            let count = 0
            jQuery(prediction).each(function() {
                count += 1
                if (
                    !jQuery(this).hasClass('selectorgadget_selected') &&
                    !jQuery(this).hasClass('selectorgadget_ignore') &&
                    !jQuery(this).hasClass('selectorgadget_rejected')
                ) {
                    return jQuery(this).addClass('selectorgadget_suggested')
                }
            })

            if (this.clear_button) {
                if (count > 0) {
                    return this.clear_button.attr('value', `Clear (${count})`)
                } else {
                    return this.clear_button.attr('value', 'Clear')
                }
            }
        }
    }

    setPath(prediction) {
        window.parent.postMessage(prediction, '*')

        if (prediction && prediction.length > 0) {
            return (this.pathOutputField.value = prediction)
        } else {
            return (this.pathOutputField.value = 'No valid path found.')
        }
    }

    refreshFromPath(e) {
        const self = (e && e.data && e.data.self) || this
        const path = self.pathOutputField.value
        self.clearSelected()
        self.suggestPredicted(path)
        return self.setPath(path)
    }

    showXPath(e) {
        const self = (e && e.data && e.data.self) || this
        const path = self.pathOutputField.value
        if (path === 'No valid path found.') {
            return
        }
        return prompt(
            `The CSS selector '${path}' as an XPath is shown below.  Please report any bugs that you find with this converter.`,
            self.predictionHelper.cssToXPath(path)
        )
    }

    clearSelected(e) {
        const self = (e && e.data && e.data.self) || this
        self.selected = []
        self.rejected = []
        jQuery('.selectorgadget_selected').removeClass(
            'selectorgadget_selected'
        )
        jQuery('.selectorgadget_rejected').removeClass(
            'selectorgadget_rejected'
        )
        self.removeBorders()
        return self.clearSuggested()
    }

    clearEverything(e) {
        const self = (e && e.data && e.data.self) || this
        self.clearSelected()
        return self.resetOutputs()
    }

    resetOutputs() {
        return this.setPath()
    }

    clearSuggested() {
        jQuery('.selectorgadget_suggested').removeClass(
            'selectorgadget_suggested'
        )
        if (this.clear_button) {
            return this.clear_button.attr('value', 'Clear')
        }
    }

    showHelp() {
        return alert(
            "Click on a page element that you would like your selector to match (it will turn green). SelectorGadget will then generate a minimal CSS selector for that element, and will highlight (yellow) everything that is matched by the selector. Now click on a highlighted element to reject it (red), or click on an unhighlighted element to add it (green). Through this process of selection and rejection, SelectorGadget helps you to come up with the perfect CSS selector for your needs.\n\nHolding 'shift' while moving the mouse will let you select elements inside of other selected elements."
        )
    }

    makeInterface() {
        // this.selectorDiv = jQuery('<div>')
        //     .attr('id', 'selectorgadget_main')
        //     .addClass('selectorgadget_bottom')
        //     .addClass('selectorgadget_ignore')

        this.pathOutputField = { value: null }
        this.remote_data = {}

        // return jQuery('body').append(this.selectorDiv)
    }

    removeInterface(e) {
        this.selectorDiv.remove()
        return (this.selectorDiv = null)
    }

    unbind(e) {
        const self = (e && e.data && e.data.self) || this
        self.unbound = true
        self.removeBorderFromDom()
        return self.clearSelected()
    }

    unbindAndRemoveInterface(e) {
        const self = (e && e.data && e.data.self) || this
        self.unbind()
        return self.removeInterface()
    }

    setOutputMode(e, output_mode) {
        const self = (e && e.data && e.data.self) || this
        return (self.output_mode = (e && e.data && e.data.mode) || output_mode)
    }

    rebind() {
        this.unbound = false
        this.clearEverything()
        return this.setupBorders()
    }

    rebindAndMakeInterface() {
        this.makeInterface()
        return this.rebind()
    }

    randBetween(a, b) {
        return Math.floor(Math.random() * b) + a
    }
}

const gadget = new SelectorGadget()
gadget.makeInterface()
gadget.clearEverything()
gadget.setMode('interactive')

window.selectorGadget = gadget
