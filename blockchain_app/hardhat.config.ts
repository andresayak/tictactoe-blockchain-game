import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";

const {config: dotEnvConfig} = require("dotenv");

dotEnvConfig({path: __dirname + '/.env'});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 5,
    token: 'BNB',
    coinmarketcap: process.env.COINMARKETCAP_KEY,
  }
};

export default config;
