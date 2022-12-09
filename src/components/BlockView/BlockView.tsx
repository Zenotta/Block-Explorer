import * as React from 'react';
import { useObserver } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../index';
import { RowTableRow } from '../RowTable/RowTable';
import { TransactionInfoProps, TxInfo } from '../TxInfo/TxInfo';
import { formatToBlockInfo } from '../../formatData';
import { CsvBtn } from '../CsvBtn/CsvBtn';

import styles from './BlockView.scss';
import { Button } from 'chi-ui';
import { itemToCsv, downloadFile } from '../../formatCsv';
import { Card } from 'components/Card/Card';
import { Block, BlockInfo, Input, Output, Transaction } from 'interfaces';

enum txBtn {
    show = "Show transactions",
    hide = "Hide transactions"
}

interface miningTxInfo {
    tokens: string,
    tokensDivided: string,
    scriptPublicKey: string,
    version: number,
}

export const BlockView = () => {
    let { hash } = useParams<any>();
    const store = React.useContext(StoreContext);
    const [transactions, setTransactions] = React.useState<TransactionInfoProps[] | null>(null);
    const [miningTx, setMiningTx] = React.useState<miningTxInfo | null>(null);
    const [localData, setLocalData] = React.useState<BlockInfo | null>(null);
    const [coinbaseHash, setCoinbaseHash] = React.useState<string>('');
    const [showTransactions, setShowTransactions] = React.useState<boolean>(true);
    const [txBtnText, setTxButtonText] = React.useState<string>(txBtn.hide);

    /**
     * Fetch coinbase transaction from miningTx hash
     * @param miningTxHash
     */
    const fetchMiningTx = async (miningTxHash: string) => {
        if (miningTxHash) {
            setCoinbaseHash(miningTxHash)
            const tx = ((await store.fetchBlockchainItem(miningTxHash)) as Transaction); // Fetch coinbase transaction
            const output = tx.outputs[0];
            const reward = (output.value as { Token: number }).Token.toString();
            const miningTxInfo: miningTxInfo = {
                tokens: reward,
                tokensDivided: (parseFloat(reward) / 25200).toFixed(2),
                scriptPublicKey: output.scriptPubKey,
                version: tx.version,
            };
            setMiningTx(miningTxInfo);
        }
    };

    /**
     * Fetch transactions from list of tx hashes
     * @param txs
     */
    const fetchTransactions = async (txs: string[]) => {
        if (txs && txs.length > 0) {
            let txsInfo = await Promise.all(
                txs.map((tx) => store.fetchBlockchainItem(tx))).then((results) => formatTransactions(results as Transaction[], txs));
            setTransactions(txsInfo);
        }
    };

    const checkSeenTxIns = (t: Input, seenIns: string[]) => {
        if (t.previousOut && t.previousOut.tHash) {
            let t_hash = t.previousOut.tHash;

            if (seenIns.indexOf(t_hash) == -1) {
                seenIns.push(t_hash);
                return true;
            }
            return false;
        }
        return false;
    };

    const extractTransactionInfo = (tx: Transaction, hashes: string[], index: number): TransactionInfoProps => {
        let seenIns: string[] = [];
        return {
            hash: hashes[index],
            totalTokens: tx.outputs.reduce((acc: number, o: Output) => acc + (o.value as { Token: number }).Token, 0),
            txInHashes: tx.inputs.filter((t: Input) => checkSeenTxIns(t, seenIns)).map((i: Input) => { return i.previousOut ? i.previousOut.tHash : '' }),
            outputs: tx.outputs.map((o: Output) => {
                return {
                    publicKey: o.scriptPubKey,
                    lockTime: o.locktime,
                    tokens: (o.value as { Token: number }).Token,
                };
            }),
        };
    };

    const formatTransactions = (transactions: Transaction[], hashes: string[]) => {
        if (!transactions || !transactions.length) {
            return [];
        }

        if (transactions.length == 1) {
            let tx = transactions[0];
            return [extractTransactionInfo(tx, hashes, 0)];
        }

        return transactions.map((tx, i) => {
            return extractTransactionInfo(tx, hashes, i);
        });
    };

    const handleShowTxButton = () => {
        if (showTransactions) {
            setShowTransactions(false);
            setTxButtonText(txBtn.show);
        } else {
            setShowTransactions(true);
            setTxButtonText(txBtn.hide);
        }
    }

    const formatDataForTable = (localData: BlockInfo): RowTableRow[] | null => {
        if (!localData) {
            return null;
        }
        return Object.keys(localData).map((key) => {
            const value = (localData as any)[key];
            if (key === 'previousHash') {
                return {
                    heading: key,
                    value: value != 'N/A' ? <a href={`/block/${value}`}>{value}</a> : value,
                };
            } else {
                return {
                    heading: key,
                    value: value,
                };
            }
        });
    };

    const formatIncomingData = (block: Block | null) => {
        if (block) {
            // Handle block transactions
            fetchTransactions(block.transactions);
            // Handle the coinbase transaction
            fetchMiningTx(block.miningTxHashNonces.hash);
            let newData: BlockInfo = formatToBlockInfo({ hash, block: block, miningTxHashAndNonces: miningTx });
            return newData;
        }
        return null;
    };

    const formatMiningTxDataForTable = (miningTx: miningTxInfo): RowTableRow[] | null => {
        if (!miningTx) {
            return null;
        }
        return [
            { heading: 'Coinbase Hash', value: <a href={'/tx/' + coinbaseHash.toString()}>{coinbaseHash.toString()}</a> },
            { heading: 'Token Reward', value: miningTx.tokensDivided.toString() },
            { heading: 'Fractionated Token Reward', value: miningTx.tokens.toString() },
            { heading: 'Version', value: miningTx.version.toString() },
            { heading: 'Script Public Key', value: miningTx.scriptPublicKey },
        ];
    };

    const downloadTxs = async () => {
        // if (transactions && transactions.length > 0) {
        //     const { txs, headers } = formatCsvTxs(transactions as any[]);
        //     if (txs.length > 1) {
        //         const csv = txsToCsv(txs, headers)
        //         downloadFile(`txs-${txs[0].hash}-${txs[txs.length - 1].hash}`, csv);
        //     } else if (txs.length == 1) {
        //         const csv = itemToCsv(txs[0]);
        //         downloadFile(`tx-${txs[0].hash}`, csv);
        //     }
        // }
    };

    const downloadCbTx = async () => {
        let tx = {
            coinbaseHash: coinbaseHash,
            ...miningTx
        }
        const csv = itemToCsv(tx);
        downloadFile(`tx-${coinbaseHash}`, csv);
    };

    const getBlockHashFromNum = async (blockNum: string) => {
        const validity = await store.blockNumIsValid(parseInt(blockNum));
        if (validity.isValid) {
            return store.fetchBlockHashByNum(parseInt(blockNum)).then((hash: string) => {
                if (hash) {
                    return hash;
                }
            });
        } else {
            console.log(validity.error);
        }
    }

    const renderNavArrows = (blockNum: number) => {
        return (
            <div className={styles.navBtnGroup}>
                {<Button onClick={async () => { window.location.href = `/block/${await getBlockHashFromNum((blockNum - 1).toString())}` }} className={`${blockNum > 0 ? '' : styles.disNav} ${styles.navBtn} ${styles.leftBtn}`} type="submit">{'<'}</Button>}{' '}
                {<Button onClick={async () => { window.location.href = `/block/${await getBlockHashFromNum((blockNum + 1).toString())}` }} className={`${store.latestBlock && blockNum < store.latestBlock.bNum ? '' : styles.disNav} ${styles.navBtn}`} type="submit">{'>'}</Button>}
            </div>)
    }

    React.useEffect(() => {
        if (!localData) {
            store.fetchBlockchainItem(hash).then((fetchedData) => {
                setLocalData(formatIncomingData(fetchedData ? fetchedData as Block : null));
            });
        }
    }, [transactions]);

    React.useEffect(() => {
        store.fetchLatestBlock();
    }, []);

    return useObserver(() => {
        if (localData) return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>
                        {'Block'} {localData.bNum && <span className={styles.blockNum}>{'#' + localData.bNum}</span>}
                    </h2>
                    {renderNavArrows(localData.bNum)}
                </div>

                {/* <CsvBtn action={() => downloadBlock()} /> */}

                {<Card rows={formatDataForTable(localData)} />}

                {transactions && transactions.length > 0 &&
                    <div className={styles.transactionContainer}>
                        <div className={styles.txHeading}>
                            <h2 className={styles.txTitle}>{'Block Transactions'}<span className={styles.badge}>{transactions.length}</span></h2>
                            <Button onClick={() => handleShowTxButton()} className={styles.txBtn}>{txBtnText}</Button>
                        </div>

                        {showTransactions && (
                            <>
                                {/* <CsvBtn action={() => downloadTxs()} /> */}
                                <div className={styles.transactionContainer}>
                                    {transactions.map((t: TransactionInfoProps, i: number) => {
                                        return (
                                            <div key={i}>
                                                <TxInfo {...t} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {!showTransactions &&
                            <span className={styles.hidden}>Transactions are hidden</span>
                        }

                    </div>
                }
                {miningTx && (
                    <>
                        <h2 className={styles.innerHeading}>
                            {'Coinbase Transaction'}
                        </h2>
                        {/* <CsvBtn action={() => downloadCbTx()} /> */}
                        <div className={styles.transactionContainer}>
                            <Card rows={formatMiningTxDataForTable(miningTx)} />
                        </div>
                    </>
                )}
                {!miningTx &&
                    <div>Loading...</div>
                }
            </div>
        )
        else {
            return <></>
        }
    });
};