import { Provider } from "react-redux";
import store from "./redux/store";
import Routes from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import { BSC, BSCTestnet, Config, DAppProvider, Hardhat } from "@usedapp/core";
import { MetamaskConnector, CoinbaseWalletConnector } from '@usedapp/core'


export const allowNetworks: { [k: number]: string } = {
  [BSC.chainId]: "https://bsc-dataseed.binance.org/",
  [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  [Hardhat.chainId]: 'http://localhost:8545/'
}

export const dappConfig: Config = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: allowNetworks,
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),
  },
  networks: [Hardhat, BSC, BSCTestnet]
}
export function App() {
  return (
    <Provider store={store}>
      <DAppProvider config={dappConfig}>
      <Routes />
      <ToastContainer />
      </DAppProvider>
    </Provider>
  );
}

export default App;
