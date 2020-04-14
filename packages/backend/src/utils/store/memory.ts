const calculateNextResetTime = (time: number) => {
    const d = new Date()
    d.setMilliseconds(d.getMilliseconds() + time)
    return d
}

class MemoryStore {
    time: number
    hits: Record<string, number> = {}
    resetTime: Date

    constructor(time: number) {
        this.time = time
        this.resetTime = calculateNextResetTime(time)

        const interval = setInterval(this.resetAll, time)

        if (interval.unref) interval.unref()
    }

    add(key: string) {
        if (this.hits[key]) {
            this.hits[key]++
        } else {
            this.hits[key] = 1
        }
    }

    remove(key: string) {
        if (this.hits[key]) {
            this.hits[key]--
        }
        if (this.hits[key] === 0) {
            delete this.hits[key]
        }
    }

    count(key: string) {
        return this.hits[key] || 0
    }

    reset(key: string) {
        delete this.hits[key]
    }

    resetAll() {
        this.hits = {}
        this.resetTime = calculateNextResetTime(this.time)
    }
}

export default MemoryStore
