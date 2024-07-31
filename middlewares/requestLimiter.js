"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimiterOptions = exports.RequestLimiter = void 0;
/**
 * Denial-Of-Service protection.
 * @description
 * Simple DOS prevention using Time Sliding Window algorithm.
 * Actually the class is extendable and can include new/other algorithms by implementing @see {@link ILimiter}
 * @todo
 * Polish and extend for specific IP addresses and so on.
 */
class RequestLimiter {
    constructor(options) {
        this.handleBrute = (req, res, next) => {
            for (var limiter of this.limiters) {
                if (!limiter.allow(req)) {
                    res.status(this.options.responseStatus).send("Sorry, too many requests");
                    return;
                }
            }
            next();
        };
        if (!options)
            options = new LimiterOptions();
        this.options = options ? options : new LimiterOptions();
        this.limiters = [new SlidingWindowLimiter(options.windowCapacity, options.windowTime)];
        this.express = this.handleBrute.bind(this);
    }
}
exports.RequestLimiter = RequestLimiter;
class LimiterOptions {
    constructor() {
        this.responseStatus = 429;
        this.windowCapacity = 50;
        this.windowTime = 1000;
    }
}
exports.LimiterOptions = LimiterOptions;
class SlidingWindowLimiter {
    constructor(capacity, window) {
        this.cache = [];
        this.capacity = capacity;
        this.window = window;
    }
    allow(req) {
        const dateNow = new Date().valueOf();
        this.cache.push(dateNow);
        const windowStart = dateNow - this.window;
        this.cache = this.cache.filter((d) => d > windowStart);
        if (this.cache.length > this.capacity) {
            return false;
        }
        return true;
    }
}
const countBy = (array, predicate) => array.reduce((count, element) => {
    return predicate(element) ? count + 1 : count;
}, 0);
//# sourceMappingURL=requestLimiter.js.map