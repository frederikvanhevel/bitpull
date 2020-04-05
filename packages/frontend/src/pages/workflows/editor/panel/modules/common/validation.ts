export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/
export const FILE_PATH_REGEX = /^(\/[\w^ ]+)+\/$/

export const validateUrl = (text: string) => {
    return URL_REGEX.test(text)
}

export const validateRelativeUrl = (text: string) => {
    return /^(\/.*)/.test(text)
}

export const validateEmail = (text: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        text
    )
}

export const validateFilePath = (text: string) => {
    return FILE_PATH_REGEX.test(text)
}

export const notEmpty = (text: string) => {
    return !!text && text !== ''
}

export const isEmpty = (text: string) => !notEmpty(text)

export const validateSelector = (selector: string) => {
    try {
        document.querySelector(selector)
        return true
    } catch (e) {
        return false
    }
}

export const hasLength = (text: string, length: number) => {
    return text.length >= length
}
