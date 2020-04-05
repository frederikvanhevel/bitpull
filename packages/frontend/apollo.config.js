module.exports = {
    client: {
        name: 'Sable Card [mobile]',
        service: {
            name: 'sable-money',
            url: 'http://localhost:5000/graphql',
            skipSslValidation: true
        }
    },
    includes: ['src/graphql/**/*.ts'],
    excludes: ['node_modules/**']
}