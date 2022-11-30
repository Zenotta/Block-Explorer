import Dexie from "dexie";
import { IDB_TX_CACHE, IDB_BLOCKS_CACHE } from "../constants";

export class BrowserCache extends Dexie {
  transactions: { [key: string]: Dexie.Table<any, number> };
  blocks: { [key: string]: Dexie.Table<any, number> };

  constructor(nets: string[]) {
    super("zen_exp_cache");
    let tables: { [key: string]: string } = {};
    this.transactions = {};
    this.blocks = {};

    nets.forEach((net) => {
      if (net.indexOf("blocks") != -1) {
        tables[net] = "++id,&bNum,&hash,previousHash,bits,version";
      } else {
        tables[net] = "++id,druidInfo,version,&hash";
      }
    });

    this.version(1).stores(tables);

    nets.forEach((net) => {
      this.transactions[net] = this.table(net);
      this.blocks[net] = this.table(net);
    });
  }

  /**
   * Fetches blocks from cache by block number
   *
   * @param {number[] | string[]} blockIds - Array of block numbers or hashes to fetch
   * @param {string} net - Network name
   * @returns {{ remainingIds: number[] | string[], blocks: any[] }} - Object containing remaining block numbers to fetch and array of retrieved blocks
   */
  async getBlocks(
    blockIds: number[] | string[],
    net: string
  ): Promise<{ remainingIds: number[] | string[]; blocks: any[] }> {
    let blocks: any[] = [];
    let remainingIds: any[] = [];

    const idSelector = typeof blockIds[0] === "number" ? "bNum" : "hash";
    const cacheName = `${IDB_BLOCKS_CACHE}_${net}`;

    // @ts-ignore
    const calls = blockIds.map((num) => {
      return this.blocks[cacheName].where(idSelector).equals(num).toArray(); // anything other than .toArray returns undefined?
    });

    await Promise.all(calls).then((results) => {
      results.forEach((result: any, idx: number) => {
        result = result[0]; // required because of .toArray() above

        // Cache hit
        if (result && result.id) {
          delete result.id;
          blocks.push(result);

          // Not present in the cache, so we need to fetch it
        } else {
          remainingIds.push(blockIds[idx]);
        }
      });
    });
    return { remainingIds, blocks };
  }

  /**
   * Fetches transactions from cache by transaction hash
   *
   * @param {string[]} txHashes - Array of transaction hashes to fetch
   * @param {string} net - Network name
   * @returns {{ remainingHashes: string[], txs: any[] }} - Object containing remaining transaction hashes to fetch and array of retrieved transactions
   */
  async getTransactions(txHashes: string[], net: string) {
    let txs: any[] = [];
    let remainingHashes: string[] = [];
    const cacheName = `${IDB_TX_CACHE}_${net}`;
    const calls = txHashes.map((hash) => {
      return this.transactions[cacheName]
        .where("hash")
        .equalsIgnoreCase(hash)
        .toArray(); // tried 'each' and nothing, just returns undefined
    });

    await Promise.all(calls).then((results) => {
      results.forEach((result: any, idx: number) => {

        result = result[0];

        // Cache hit
        if (result && result.id) {
          delete result.id;
          txs.push(result);

          // Not present in the cache, so we need to fetch it
        } else {
          remainingHashes.push(txHashes[idx]);
        }
      });
    });

    return { remainingHashes, txs };
  }

  /**
   * Adds provided transaction to the browser cache
   *
   * @param {any} tx - Transaction data
   * @param {string} net - Network name
   */
  async addTransaction(tx: any, net: string) {
    const cacheName = `${IDB_TX_CACHE}_${net}`;

    // Check entry doesn't exist
    const txExist = await this.transactions[cacheName].get({
      hash: tx.hash,
    });

    if (!txExist) {
      this.transactions[cacheName].add(tx);
    }
  }

  /**
   * Adds provided blocks to the browser cache
   *
   * @param {any[]} blocks - Array of blocks to add to cache
   * @param {string} net - Network name
   */
  async addBlocks(blocks: any[], net: string) {
    const cacheName = `${IDB_BLOCKS_CACHE}_${net}`;

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];

      const newBlock = { 
        hash: block.hash,
        bNum: block.block.bNum,
        block: block.block,
      }
      
      const blockExist = await this.blocks[cacheName].get({
        hash: newBlock.hash,
        bNum: newBlock.bNum,
      });

      if (!blockExist) {
        this.blocks[cacheName].add(newBlock);
      }
    }
  }
}
