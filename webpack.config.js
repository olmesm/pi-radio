module.exports = {
    entry: "./private/app/js/main.js",
    output: {
        path: __dirname,
        filename: "public/js/app.js"
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015']
              }
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            },
        ]
    }
};
