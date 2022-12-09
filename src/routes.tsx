import App from 'components/App/App';
import { BlockExplorer } from 'components/BlockExplorer/BlockExplorer';
import { TxsExplorer } from 'components/TxsExplorer/TxsExplorer';
import { BlockView } from 'components/BlockView/BlockView';
import { TxView } from 'components/TxView/TxView';
import { CsvBlockExport } from 'components/CsvBlockExport/CsvBlockExport';
import { CsvTxExport } from 'components/CsvTxExport/CsvTxExport';
import { Overview } from 'components/Overview/Overview';

/**
 * Nav route items
*/
export interface MainRoutes {
  path: string;
  name: string;
  Component: any;
  hidden?: boolean;
}
/**
 * These routes will be automatically generated in App.tsx.
 * Routes items are also generated in nav as links, if "hidden" property is set to true, the item is not visible in nav.
 */
export const routes: MainRoutes[] = [
  { path: '/', name: 'Home', Component: Overview },
  {
    path: '/blocks',
    name: 'Blocks',
    Component: BlockExplorer
  },
  {
    path: '/txs',
    name: 'Transactions',
    Component: TxsExplorer,
  },
  {
    path: '/block/:hash',
    name: 'Block view',
    Component: BlockView,
    hidden: true
  },
  {
    path: '/tx/:hash',
    name: 'Tx view',
    Component: TxView,
    hidden: true
  },
  {
    path: '/csv-block-export', 
    name: 'CSV Block export',
    Component: CsvBlockExport,
    hidden: true
  },
  {
    path: '/csv-tx-export',
    name: 'CSV Transaction export',
    Component: CsvTxExport,
    hidden: true
  }
];
