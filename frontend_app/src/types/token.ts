import { BigNumber } from "ethers";

export type TokenDataType = {
  address: string;
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
  allowanceBN: BigNumber;
};

