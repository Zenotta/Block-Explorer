import { NETWORKS } from '../src/networks';
import { latestBlock, blockRange, blockchainItem } from "../utils/routes";
import { GENESIS_BLOCK, GENESIS_BLOCK_WITH_TX } from './stubs';

const config = require('../utils/config');
const fullConfig = config.getConfig('./serverConfig.json');
const DragonflyCache = require('dragonfly-cache').DragonflyCache;

// Caches
const blocksCache = new DragonflyCache();
const txsCache = new DragonflyCache();
const bNumCache = new DragonflyCache();

describe("routes", () => {
    test("/latestBlock", async () => {
        const req = {
            body: {
                network: NETWORKS[0],
            }
        };

        const res = {
            text: '',
            status: function (code) { this.statusCode = code; return this; },
            send: function (input) { this.text = input },
            json: function (input) { this.text = input }
        };

        await latestBlock(req, res, fullConfig);

        expect(res.text).toBeTruthy();
        expect(res.text.content.block.header.b_num).toBeGreaterThan(70000);
    });

    test("/blockRange", async () => {
        const req = {
            body: {
                network: NETWORKS[0],
                nums: [0]
            }
        };

        const res = {
            text: '',
            status: function (code) { this.statusCode = code; return this; },
            send: function (input) { this.text = input },
            json: function (input) { this.text = input }
        };

        await blockRange(req, res, fullConfig, bNumCache, blocksCache);

        expect(res.text).toBeTruthy();
        expect(res.text).toEqual([GENESIS_BLOCK_WITH_TX]);
    });

    test("/blockchainItem", async () => {
        const req = {
            body: {
                network: NETWORKS[0],
                hash: 'eefe384b4d3b90efbfea42cde0f4aaa0723048f461be1d767eb9c602b7a1aca0'
            }
        };

        const res = {
            text: '',
            status: function (code) { this.statusCode = code; return this; },
            send: function (input) { this.text = input },
            json: function (input) { this.text = input }
        };

        await blockchainItem(req, res, fullConfig, blocksCache, txsCache);

        expect(res.text).toBeTruthy();
        expect(res.text).toEqual(GENESIS_BLOCK);
    });
});