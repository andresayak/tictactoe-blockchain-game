import React from "react";
import { BigNumber, utils } from "ethers";
import { ethers } from "ethers/lib.esm";
import { useContractCalls } from "@usedapp/core";
import ERC20TokenAbi from "../contracts/ERC20.sol/ERC20.json";
import { TokenDataType } from "../types/token";

export const TokenWrap = (props: {
  children: (tokenData:TokenDataType)=>React.ReactElement
  setErrors?: (errors: any) => void;
  account: string | undefined; tokenAddress: string;
  spenderAddress: string
}) => {
  const { spenderAddress, account, children, tokenAddress, setErrors } = props;

  let tokenBalance: any = 0;
  let tokenDecimals: any = 18;
  let tokenSymbol: any = "";
  let tokenAllowanceBN: BigNumber = BigNumber.from(0);
  let tokenBalanceBN: BigNumber = BigNumber.from(0);
  let name: string;
  if(tokenAddress && ethers.utils.isAddress(tokenAddress)) {
    try {
      const result = useContractCalls([{
        abi: new utils.Interface(ERC20TokenAbi.abi),
        address: tokenAddress,
        method: "balanceOf",
        args: [account],
      }, {
        abi: new utils.Interface(ERC20TokenAbi.abi),
        address: tokenAddress,
        method: "decimals",
        args: [],
      }, {
        abi: new utils.Interface(ERC20TokenAbi.abi),
        address: tokenAddress,
        method: "symbol",
        args: [],
      }, {
        abi: new utils.Interface(ERC20TokenAbi.abi),
        address: tokenAddress,
        method: "allowance",
        args: [account, spenderAddress],
      }, {
        abi: new utils.Interface(ERC20TokenAbi.abi),
        address: tokenAddress,
        method: "name",
        args: [],
      }]) ?? [];
      if (result && result[0] && result[1] && result[2]
        && result[3] && result[4]
      ) {
        tokenBalanceBN = result[0][0];
        tokenDecimals = result[1][0];
        tokenSymbol = result[2][0];
        tokenAllowanceBN = result[3][0];
        name = result[4][0];
        tokenBalance = utils.formatUnits(tokenBalanceBN, tokenDecimals);
        return children({
          address: tokenAddress,
          balance: tokenBalance,
          decimals: tokenDecimals,
          symbol: tokenSymbol,
          allowanceBN: tokenAllowanceBN,
          name
        });
      }
    } catch (e: unknown) {
      console.log(e);
      if(setErrors){
        if (e && e.toString().match(/call revert exception/)) {
          setErrors({ tokenAddress: ["Invalid token address"] });
        }
      }
    }
  }
  return null;
};
