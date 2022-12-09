import * as React from 'react';
import { useObserver } from 'mobx-react';
import { Button } from 'chi-ui';
import { StoreContext } from '../../index';
import styles from './CsvBlockExport.scss';
import { blockRangeToCsv, downloadFile } from '../../formatCsv';

const DEFAULT_WARNING = 'Please enter range of blocks to export';

export const CsvBlockExport = () => {
  const store = React.useContext(StoreContext);
  const [startingBlock, setStartingBlock] = React.useState<number>(0);
  const [endingBlock, setEndingBlock] = React.useState<number>(9);
  const [warningMsg, setWarningMsg] = React.useState<string>(DEFAULT_WARNING);
  const [blockRange, setBlockRange] = React.useState<string>('');
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const valueCheck = async (start: number, end: number) => {
    setDisabled(true);
    if (start >= end) {
      setWarningMsg('Starting block must be less than ending block');
    } else {
      const sBlock = await store.blockNumIsValid(start); // Add timeouts
      const eBlock = await store.blockNumIsValid(end);

      if (!sBlock.isValid) {
        setWarningMsg(sBlock.error);
      } else if (!eBlock.isValid) {
        setWarningMsg(eBlock.error);
      } else {
        setBlockRange(`Number of selected blocks : ${(end - start) + 1}`)
        setDisabled(false);
        setWarningMsg('');

      }
    }
  };

  const downloadBlockRange = async () => {
    if (!disabled && startingBlock >= 0 && endingBlock) {
      setLoading(true);
      store
        .fetchBlockRange(startingBlock, endingBlock)
        .then((blockRange: any) => {
          if (blockRange.length > 0) {
            let csv = blockRangeToCsv(blockRange);
            downloadFile(`block_range_${startingBlock}_${endingBlock}.csv`, csv);
            setWarningMsg('');
          }
        })
        .catch((err: any) => {
          setWarningMsg('Range is to big, please reduce range size');
          console.log(err.message);
        });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (startingBlock >= 0 && endingBlock) {
      valueCheck(startingBlock, endingBlock);
    } else {
      setDisabled(true);
      setWarningMsg(DEFAULT_WARNING);
    }

    if (!store.latestBlock) {
      store.fetchLatestBlock().then(() => {
        if (store.latestBlock) {
          setStartingBlock(store.latestBlock.bNum >= 9 ? store.latestBlock.bNum - 9 : 9)
          setEndingBlock(store.latestBlock.bNum)
        }
      });
    }
  }, [startingBlock, endingBlock]);

  return useObserver(() => (
    <div className={styles.container}>
      <h2 className={styles.heading}>Csv Export - Blocks</h2>

      <div className={styles.content}>
        <p>Export block range</p>
        <div className={styles.inputs}>
          <input
            className={styles.txtInput}
            type='number'
            value={startingBlock}
            placeholder="Start Block Number"
            onChange={(e: { target: { value: string } }) => {
              const val = e.target.value;
              setStartingBlock(val ? parseInt(val) : 0);
            }}
          />
          {'to'}
          <input
            className={styles.txtInput}
            type='number'
            value={endingBlock}
            placeholder="End Block Number"
            onChange={(e: { target: { value: string } }) => {
              const val = e.target.value;
              setEndingBlock(val ? parseInt(val) : 0);
            }}
          />
        </div>
        {warningMsg == '' && blockRange && <p className={styles.blockRange}>{blockRange}</p>}
        {warningMsg && <p className={styles.warningMsg}>{warningMsg}</p>}
        <Button
          className={styles.btn}
          onClick={() => {
            downloadBlockRange();
          }}
          disabled={disabled}
          loading={loading}
        >
          Download CSV
        </Button>
      </div>
    </div>
  ));
};