import { ethers } from "ethers/lib.esm";
import { BigNumber } from "ethers";

export const createBN = (value: string, decimals: number) => {
  try {
    return value ? ethers.utils.parseUnits(value, decimals) : BigNumber.from("0");
  } catch (e) {
    return BigNumber.from("0");
  }
};
