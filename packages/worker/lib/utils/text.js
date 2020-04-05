"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = (phrase) => {
    return phrase
        .replace('_', ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
