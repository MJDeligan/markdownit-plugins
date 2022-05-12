/*
Changes the relative path of media uris from the
strapi markdown to absolute paths to make proper
loading of these resources possible.
*/
export default function plugin (md) {
    // save render function for later use because it is overwritten
    const defaultRenderer = md.renderer.rules.image
    // new render function for images
    md.renderer.rules.image = function (tokens, idx, options, env, slf) {
        const token = tokens[idx]
        // image source from backend starts with /uploads
        // could include a pattern as env variable
        const relativeMediaPath = /^\/uploads\/.*/
        token.attrs = token.attrs.map((attr) => {
            // change sources of images served from backend to be absolute instead of relative
            if (attr[0] === 'src' && relativeMediaPath.test(attr[1])) {
                attr[1] = process.env.backendUri + attr[1]
            }
            return attr
        })
        return defaultRenderer(tokens, idx, options, env, slf)
    }
}
