const fs = require('fs');
const DEFAULTS = {
    port: 8090,
    storageNode: "http://localhost:3002",
    computeNode: "http://localhost:3001",
    localNode: "http://localhost",
    localPort: 8090,
    cacheCapacity: 100,
    protocol: "http"
};

function getConfig(path) {
    const obj = path ? JSON.parse(fs.readFileSync(path, 'utf8')) : {};

    return {
        PORT: obj.port || DEFAULTS.port,
        STORAGE_NODE: obj.storageNode || DEFAULTS.storageNode,
        COMPUTE_NODE: obj.computeNode || DEFAULTS.computeNode,
        LOCAL_NODE: obj.localNode || DEFAULTS.localNode,
        LOCAL_PORT: obj.localPort || DEFAULTS.localPort,
        CACHE_CAPACITY: obj.cacheCapacity || DEFAULTS.cacheCapacity,
        PROTOCOL: obj.protocol || DEFAULTS.protocol
    };
}

module.exports = {
    getConfig
}