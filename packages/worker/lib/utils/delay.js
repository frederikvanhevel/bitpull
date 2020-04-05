"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
};
exports.randomizedDelay = (minDuration = 1000, maxDuration = 1200) => {
    const duration = Math.floor(Math.random() * maxDuration) + minDuration;
    return exports.delay(duration);
};
async function retryBackoff(fn, retries, delayTime = 100) {
    return fn().catch((error) => retries > 1
        ? exports.delay(delayTime).then(() => retryBackoff(fn, retries - 1, delayTime * 2))
        : Promise.reject(error));
}
exports.retryBackoff = retryBackoff;
