"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToBottom = exports.removeAttribute = exports.stripScriptTags = void 0;
exports.stripScriptTags = async (page) => {
    await page.evaluate(`
        var r = document.getElementsByTagName('script');
        for (var i = (r.length - 1); i >= 0; i--) {
            if (r[i].getAttribute('id') != 'a') {
                r[i].parentNode.removeChild(r[i]);
            }
        }
    `);
};
exports.removeAttribute = async (page, tag, attr) => {
    await page.evaluate(`
        var r = document.getElementsByTagName('${tag}');
        for (var i = (r.length - 1); i >= 0; i--) {
            if (r[i].getAttribute('${attr}')) {
                r[i].removeAttribute('${attr}');
            }
        }
    `);
};
exports.scrollToBottom = async (page, scrollStep = 250, scrollDelay = 100) => {
    const lastPosition = await page.evaluate(async (step, delay) => {
        const getScrollHeight = (element) => {
            const { scrollHeight, offsetHeight, clientHeight } = element;
            return Math.max(scrollHeight, offsetHeight, clientHeight);
        };
        const position = await new Promise(resolve => {
            let count = 0;
            const intervalId = setInterval(() => {
                const { body } = document; // eslint-disable-line
                const availableScrollHeight = getScrollHeight(body);
                window.scrollBy(0, step); // eslint-disable-line
                count += step;
                if (count >= availableScrollHeight) {
                    clearInterval(intervalId);
                    resolve(count);
                }
            }, delay);
        });
        return position;
    }, scrollStep, scrollDelay);
    return lastPosition;
};
//# sourceMappingURL=scripts.js.map