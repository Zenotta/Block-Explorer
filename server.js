const fs = require('fs');
const express = require('express');
const https = require('https');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const config = require('./utils/config');
const routes = require('./utils/routes');
const DragonflyCache = require('dragonfly-cache').DragonflyCache;

// Server setup
const app = express();
const env = process.env.NODE_ENV || 'production';
const fullConfig = env == 'production' ? config.getConfig('./serverConfig.json') : config.getConfig();
const port = process.env.PORT || fullConfig.PORT;

console.log(`Starting server in ${env} mode`);

// Middleware
if (env == 'development') {
    app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(compression());

// Latest block
let latestBlock = 0;

// Caches
const blocksCache = new DragonflyCache();
const txsCache = new DragonflyCache();
const bNumCache = new DragonflyCache();

/** Fetch latest block */
app.post('/api/latestBlock', (req, res) => routes.latestBlock(req, res, fullConfig));

/** Fetch blockchain item */
app.post('/api/blockchainItem', (req, res) => routes.blockchainItem(req, res, txsCache, blocksCache));

/** Fetch block range */
app.post('/api/blockRange', (req, res) => routes.blockRange(req, res, bNumCache, blocksCache));

/** Use static */
app.use(express.static('./public'));

// Let react-router handle routing
app.get('*', function (_, res) {
    res.sendFile('public/index.html', { root: path.join(__dirname, '/') });
});

if (env == 'development') {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
} else if (env == 'production') {
    const httpsOptions = {
        ca: fs.readFileSync("public/chain.pem", 'utf8'),
        key: fs.readFileSync("public/privkey.pem", 'utf8'),
        cert: fs.readFileSync("public/cert.pem", 'utf8')
    };

    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
