export const delay = (duration: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export const randomizedDelay = (
    minDuration: number = 1000,
    maxDuration: number = 1200
): Promise<void> => {
    const duration = Math.floor(Math.random() * maxDuration) + minDuration
    return delay(duration)
}

export async function retryBackoff<T>(
    fn: Function,
    retries: number,
    delayTime = 100
): Promise<T> {
    return fn().catch((error: Error) =>
        retries > 1
            ? delay(delayTime).then(() =>
                  retryBackoff(fn, retries - 1, delayTime * 2)
              )
            : Promise.reject(error)
    )
}
