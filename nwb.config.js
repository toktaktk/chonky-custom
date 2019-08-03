const path = require('path');

module.exports = {
    type: 'react-component',
    npm: {
        esModules: true,
        // umd: {
        //     global: 'Chonky',
        //     externals: {
        //         react: 'React',
        //     },
        // },
    },
    webpack: {
        html: {
            template: 'demo/src/index.html',
        },
        config(config) {
            config.resolve.extensions = ['.ts', '.tsx', '.js', '.json'];
            config.devtool = 'source-map';
            config.module.rules.push({
                'test': /\.tsx?$/,
                'loader': 'awesome-typescript-loader',
            });

            return config;
        },
    },
};
