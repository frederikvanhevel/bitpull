export const capitalizeWords = (phrase: string) => {
    return phrase
        .replace('_', ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const truncate = (text: string, length: number = 30) => {
    return text.substring(0, Math.min(length, text.length)) + '...'
}
