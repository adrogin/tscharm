module.exports = {
    presets: [
        ['@babel/env'],
        ["@babel/preset-typescript"]
    ],
    env: {
        test: {
            presets: [
                ['@babel/env', { targets: { node: 'current' } }],
                '@babel/typescript'
            ]
        },
    },
};
