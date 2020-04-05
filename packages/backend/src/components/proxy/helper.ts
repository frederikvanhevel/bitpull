export const addScript = (html: string, script: string): string => {
    return html.replace('</body>', `${script}</body>`)
}

export const addSelectorScript = (html: string): string => {
    return addScript(
        html,
        `<script src="${process.env.APP_URL}/selector.js"></script>`.replace(
            /\n/g,
            ' '
        )
    )
}
