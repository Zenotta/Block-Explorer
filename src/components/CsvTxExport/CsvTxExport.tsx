// ! \\ Unfinished component
// Must wait for db to be updated with transactions handling before completing this component


import * as React from 'react';
import { useObserver } from 'mobx-react';
import { Button } from 'chi-ui';
import { StoreContext } from '../../index';
import styles from './CsvTxExport.scss';

const DEFAULT_WARNING = 'Please enter range of transactions to export';

export const CsvTxExport = () => {
  const store = React.useContext(StoreContext);
  const [startingTx, setStartingTx] = React.useState<number>(0);
  const [endingTx, setEndingTx] = React.useState<number>(9);
  const [warningMsg, setWarningMsg] = React.useState<string>(DEFAULT_WARNING);
  const [txRange, setTxRange] = React.useState<string>('');
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const valueCheck = async (start: number, end: number) => {
    setDisabled(true);
    if (start >= end) {
      setWarningMsg('Starting transaction number must be less than ending transaction');
    } else {
      // const sBlock = await store.blockNumIsValid(start); // Add timeouts
      // const eBlock = await store.blockNumIsValid(end);

      // if (!sBlock.isValid) {
      //   setWarningMsg(sBlock.error);
      // } else if (!eBlock.isValid) {
      //   setWarningMsg(eBlock.error);
      // } else {
      //   setTxRange(`Number of selected transactions : ${(end - start) + 1}`)
      //   setDisabled(false);
      //   setWarningMsg('');
      // }
    }
  };

  const downloadTxRange = async () => {
    if (!disabled && startingTx >= 0 && endingTx) {
      setLoading(true);
      
      // store
      //   .fetchBlockRange(startingTx, endingTx)
      //   .then((blockRange: any) => {
      //     if (blockRange.length > 0) {
      //       let csv = blockRangeToCsv(blockRange);
      //       downloadFile('transaction_range.csv', csv);
      //       setWarningMsg('');
      //     }
      //   })
      //   .catch((err: any) => {
      //     setWarningMsg('Range is to big, please reduce range size');
      //     console.log(err.message);
      //   });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (startingTx >= 0 && endingTx) {
      valueCheck(startingTx, endingTx);
    } else {
      setDisabled(true);
      setWarningMsg(DEFAULT_WARNING);
    }

    // if (!store.latestBlock) {
    //   store.fetchLatestBlock().then(() => {
    //     if (store.latestBlock) {
    //       setStartingTx(store.latestBlock.bNum >= 9 ? store.latestBlock.bNum - 9 : 9)
    //       setEndingTx(store.latestBlock.bNum)
    //     }
    //   });
    // }
  }, [startingTx, endingTx]);

  return useObserver(() => (
    <div className={styles.container}>
      <h2 className={styles.heading}>Csv Export - Transactions</h2>

      <div className={styles.content}>
        <p>Export transaction range</p>
        <div className={styles.inputs}>
          <input
            className={styles.txtInput}
            type='number'
            value={startingTx}
            placeholder="Start Block Number"
            onChange={(e: { target: { value: string } }) => {
              const val = e.target.value;
              setStartingTx(val ? parseInt(val) : 0);
            }}
          />
          {'to'}
          <input
            className={styles.txtInput}
            type='number'
            value={endingTx}
            placeholder="End Block Number"
            onChange={(e: { target: { value: string } }) => {
              const val = e.target.value;
              setEndingTx(val ? parseInt(val) : 0);
            }}
          />
        </div>
        {warningMsg == '' && txRange && <p className={styles.blockRange}>{txRange}</p>}
        {warningMsg && <p className={styles.warningMsg}>{warningMsg}</p>}
        <Button
          className={styles.btn}
          onClick={() => {
            downloadTxRange();
          }}
          disabled={true}
          loading={loading}
        >
          Download CSV
        </Button>
      </div>
    </div>
  ));
};