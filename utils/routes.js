const calls = require('./calls');
const Semaphore = require('./semaphore').Semaphore;
const { extractTxs } = require('./getTransactions');

// Semaphore
const throttler = new Semaphore(1); // Semaphore to limit the number of concurrent requests to 1
let latestBlock = 0;

/** Fetches the latest block */
async function latestBlock(req, res, fullConfig) {
    const network = req.body.network;
    const storagePath = `${fullConfig.PROTOCOL}://${network.sIp}:${network.sPort}/latest_block`;

    await calls.fetchLatestBlock(storagePath).then(lb => {
        try {
            throttler.callFunction(extractTxs, lb.content.block.header.b_num, network, fullConfig).then(res => console.log(res)).catch(err => console.log(err));
            latestBlock = lb.content.block.header.b_num;
        } catch (error) {
            console.log('Failed to retrieve latest block: ', error);
        }
        res.json(lb);
    }).catch(error => {
        res.status(500).send(error);
    });
};

/** Fetches a specific blockchain item */
async function blockchainItem(req, res, fullConfig, txsCache, blocksCache) {
    const network = req.body.network;
    const hash = req.body.hash;
    const storagePath = `${fullConfig.PROTOCOL}://${network.sIp}:${network.sPort}/blockchain_entry`;
    const genesisTxRegex = /0{5}[0-9]/;
    const isBlock = hash[0] !== 'g' && !hash.match(genesisTxRegex);

    let posEntry = null;

    if (isBlock)
        posEntry = blocksCache.get(hash);
    else  // Transaction
        posEntry = txsCache.get(hash);

    if (!posEntry) {
        await calls.fetchBlockchainItem(storagePath, hash).then(bItem => {
            if (bItem.content.hasOwnProperty('Block')) {
                blocksCache.add(hash, bItem.content);
            } else if (bItem.content.hasOwnProperty('Transaction')) {
                txsCache.add(hash, bItem.content);
            }
            res.json(bItem.content);
        }).catch(error => {
            res.status(500).send(error);
        });
    } else { // Serving from cache
        res.json(posEntry);
    }
}

/** Fetches blocks within a range of block numbers */
async function blockRange(req, res, fullConfig, bNumCache, blocksCache) {
    const network = req.body.network;
    const storagePath = `${fullConfig.PROTOCOL}://${network.sIp}:${network.sPort}/block_by_num`;
    const storagePathLatest = `${fullConfig.PROTOCOL}://${network.sIp}:${network.sPort}/latest_block`;
    let nums = Array.isArray(req.body.nums) ? req.body.nums.filter(num => Number.isFinite(num)) : [];
    let unknowns = [];
    let knowns = [];

    latestBlock = await calls.fetchLatestBlock(storagePathLatest).then(lBlock => {
        return lBlock.content.block.header.b_num;
    }).catch(error => {
        res.status(500).send(error)
    });

    for (let n of nums) {
        if (n <= latestBlock && n >= 0) {
            let posEntry = bNumCache.get(n);
    
            if (posEntry) {
                knowns.push(posEntry);
            } else {
                unknowns.push(n);
            }
        }
    }

    if (unknowns.length) {
        await calls.fetchBlockRange(storagePath, unknowns).then(response => {
            if (response.status == 'Success' && response.content.length) {
                for (let b of response.content) {
                    bNumCache.add(b[1].block.header.b_num, b);
                    // Add to blocksCache too coz why not
                    if (!blocksCache.get(b[0])) {
                        blocksCache.add(b[0], { "Block": b[1] });
                    }
                    knowns.push(b);
                }
                res.json(knowns);
            }
        }).catch(error => {
            res.status(500).send(error);
        });
    } else {
        res.json(knowns);
    }
}

module.exports = {
    latestBlock,
    blockchainItem,
    blockRange
}