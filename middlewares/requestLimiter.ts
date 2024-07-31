import { Request, Response, NextFunction, RequestHandler } from "express"

/**
 * Denial-Of-Service protection.
 * @description 
 * Simple DOS prevention using Time Sliding Window algorithm.
 * Actually the class is extendable and can include new/other algorithms by implementing @see {@link ILimiter}
 * @todo
 * Polish and extend for specific IP addresses and so on.
 */
export class RequestLimiter {
    options: LimiterOptions
    express: RequestHandler
    private limiters: Array<ILimiter>
    constructor(options?: LimiterOptions) {
        if (!options) options = new LimiterOptions()
        this.options = options ? options : new LimiterOptions()

        this.limiters = [new SlidingWindowLimiter(options.windowCapacity, options.windowTime)]

        this.express = this.handleBrute.bind(this)
    }

    handleBrute = (req: Request, res: Response, next: NextFunction) => {
        for (var limiter of this.limiters) {
            if (!limiter.allow(req)) {
                res.status(this.options.responseStatus).send("Sorry, too many requests")
                return
            }
        }
        next()
    }
}

export class LimiterOptions {
    responseStatus: number = 429
    windowCapacity: number = 50
    windowTime: number = 1000
}

interface ILimiter {
    allow(req: Request): boolean
}

class SlidingWindowLimiter implements ILimiter {
    cache: number[]
    capacity: number
    window: number

    constructor(capacity: number, window: number) {
        this.cache = []
        this.capacity = capacity
        this.window = window
    }

    allow(req: Request) {
        const dateNow = new Date().valueOf()
        this.cache.push(dateNow)

        const windowStart = dateNow - this.window
        this.cache = this.cache.filter((d) => d > windowStart)

        if (this.cache.length > this.capacity) {
            return false
        }

        return true
    }
}

const countBy = <T>(array: Array<T>, predicate: (T) => boolean): number =>
    array.reduce((count, element) => {
        return predicate(element) ? count + 1 : count
    }, 0)