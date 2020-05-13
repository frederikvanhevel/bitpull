"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const differenceInSeconds_1 = __importDefault(require("date-fns/differenceInSeconds"));
class Timer {
    start() {
        this.startTime = new Date();
    }
    end() {
        if (!this.startTime) {
            throw new Error('Timer not started.');
        }
        const endTime = new Date();
        const seconds = differenceInSeconds_1.default(endTime, this.startTime);
        this.startTime = undefined;
        return seconds;
    }
}
exports.default = Timer;
//# sourceMappingURL=timer.js.map