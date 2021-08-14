const { join } = require('path');

module.exports = {
    mode: 'production',
    entry: join(__dirname, 'dist', 'index.js'),
    output: {
        path: join(__dirname, 'dist'),
        filename: 'rayconnect-client.bundle.js',
    },
};
