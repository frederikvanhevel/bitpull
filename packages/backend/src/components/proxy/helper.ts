import Config from 'utils/config'

export const addScript = (html: string, script: string): string => {
    return html.replace(/<\/body>/g, `${script}</body>`)
}

export const addSelectorScript = (html: string): string => {
    return addScript(
        html,
        `<script src="${Config.APP_URL}/selector.js"></script>`.replace(
            /\n/g,
            ' '
        )
    )
}
