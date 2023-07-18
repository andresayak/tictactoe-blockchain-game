# TicTacToe contracts


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy_factory.ts
```

### Deploy contracts

#### Testnet

```shell
npx hardhat run scripts/deploy_factory.ts --network bsc_testnet
```

#### Mainnet

```shell
npx hardhat run scripts/deploy_factory.ts --network bsc_mainnet
```

#### Verify contracts

```shell
npx hardhat verify --network <bsc_testnet|bsc_mainnet> <factoryAddress>
```
