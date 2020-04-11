declare module '*.svg' {
    const value: any
    export default value
}

declare module '*.png' {
    const value: any
    export default value
}

declare namespace analytics {
    function load(token: string)
    function identify(userId: string, traits?: object)
    function track(event: string, traits?: object)
    function page(path: string)
    function reset()
}
