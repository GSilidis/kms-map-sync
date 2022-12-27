const fs = require('fs');
const packageJson = require('./package.json');
const webpack = require('webpack');

let config;
try {
    config = require('./config.json');
} catch (e) {
    console.error('Config not found! Please create config.json from config.example.json');
    process.exit(1);
}

let entries = {};

const modulesToResolve = [
    'tutorials/',
    'node_modules'
];

fs.readdirSync(__dirname + '/tutorials/cases').forEach(fileName => {
    if (fileName.substr(-2) === 'ts')
        Object.assign(entries, {[`${fileName}.example`]: `cases/${fileName}`})
})

module.exports = {
    context:  __dirname,
    entry:   entries,
    resolve: {
        modules: modulesToResolve,
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.css/,
            use: [
                'style-loader',
                'css-loader'
            ],
        }, {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    output:  {
        path:          `${__dirname}/docs/${packageJson.name}/${packageJson.version}/js`,
        filename:      '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.DefinePlugin({
            MAPTILER_KEY: JSON.stringify(config['maptiler-key']),
        }),
    ],
};
