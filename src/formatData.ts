import { Block, BlockInfo, Transaction } from "interfaces";

export const formatToBlockInfo = (data: any): BlockInfo => {
  const block: Block = data.block;

  const blockInfo: BlockInfo = {
    bNum: block.bNum,
    hash: data.hash,
    merkleRootHash: block.merkleRootHash.merkleRootHash || "N/A",
    previousHash: block.previousHash || "N/A",
    version: block.version,
    byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
    nbTransactions: block.transactions.length,
    unicornSeed: getUnicornSeed(block.seed) || "N/A",
    unicornWitness: getUnicornWitness(block.seed) || "N/A",
  };
  return blockInfo;
};

export const formatNumber = (num: string | number): string => {
  let target = "";
  if (typeof num === "number") target = num.toString();
    else target = num;
  return target.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

export const formatAddressForDisplay = (address: string, nbChar: number) => {
  if (address) {
    let displayAddress = address;
    if (address.length > nbChar) {
      displayAddress =
        address.substring(0, nbChar / 2) +
        "..." +
        address.substring(address.length - nbChar / 2, address.length);
    }
    return displayAddress;
  } else {
    return "N/A";
  }
};

export const formatAmount = (tx: Transaction) => {
  let result = 0;
  if (tx.outputs.length > 1) {
    if (tx.outputs[0].value.hasOwnProperty("Token")) {
      result = tx.outputs.reduce(
        (acc: number, o: any) => acc + o.value.Token,
        0
      );
    }
  } else if (tx.outputs.length != 0) {
    if (tx.outputs[0].value.hasOwnProperty("Token")) {
      result += (tx.outputs[0].value as { Token: number }).Token;
    }
  }
  return formatNumber((result / 25200).toFixed(2));
};

const getUnicornSplit = (rawUnicornArray: any[]): string[] => {
  // Required due to mobx proxy
  if (typeof rawUnicornArray == "object") {
    rawUnicornArray = rawUnicornArray.slice();
  }
  const unicornSeed = binToString(rawUnicornArray);
  return unicornSeed.split("-");
};

const getUnicornSeed = (rawUnicornArray: any[]) => {
    const unicornSplit = getUnicornSplit(rawUnicornArray);
    return unicornSplit[0];
};

const getUnicornWitness = (rawUnicornArray: any[]) => {
    const unicornSplit = getUnicornSplit(rawUnicornArray);
    return unicornSplit[1];
};

const binToString = (array: any[]) => {
  // Required due to mobx proxy
  if (typeof array == "object") {
    array = array.slice();
  }

  return String.fromCharCode.apply(String, array);
};
