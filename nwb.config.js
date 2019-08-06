module.exports = {
    type: 'react-component',
    npm: {
        esModules: true,
        umd: false,
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
