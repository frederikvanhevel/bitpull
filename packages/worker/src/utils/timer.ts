import differenceInSeconds from 'date-fns/differenceInSeconds'

class Timer {
    startTime?: Date

    start() {
        this.startTime = new Date()
    }

    end(): number {
        if (!this.startTime) {
            throw new Error('Timer not started.')
        }

        const endTime = new Date()
        const seconds = differenceInSeconds(endTime, this.startTime)
        this.startTime = undefined
        return seconds
    }
}

export default Timer
