export const capitalizeWords = (phrase: string) => {
    return phrase
        .replace('_', ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
