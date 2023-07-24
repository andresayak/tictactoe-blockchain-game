export interface Chain {
  chainId: number;
  chainName: string;
  isTestChain: boolean;
  isLocalChain: boolean;


  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const BSC: Chain = {
  chainId: 56,
  chainName: "Smart Chain",
  isTestChain: false,
  isLocalChain: false,
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
};

export const BSCTestnet: Chain = {
  chainId: 97,
  chainName: "Smart Chain Testnet",
  isTestChain: true,
  isLocalChain: false,
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
};

export const Hardhat: Chain = {
  chainId: 31337,
  chainName: "Hardhat",
  isTestChain: true,
  isLocalChain: true,
};
