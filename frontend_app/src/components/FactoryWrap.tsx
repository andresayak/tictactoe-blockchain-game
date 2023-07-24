import React from "react";
import { utils } from "ethers";
import { ethers } from "ethers/lib.esm";
import { useContractCalls } from "@usedapp/core";
import Factory from "../contracts/Factory.sol/Factory.json";
import { FactoryDataType } from "../types/factory";

export const FactoryWrap = (props: {
  errors: any,
  children: (factoryData:FactoryDataType)=>React.ReactElement
  setErrors?: (errors: any) => void;
  account: string | undefined; factoryAddress: string;
}) => {
  const { children, factoryAddress, setErrors } = props;
  let currentTime: any = 0;
  if(factoryAddress && ethers.utils.isAddress(factoryAddress)) {
    try {
      const result = useContractCalls([{
        abi: new utils.Interface(Factory.abi),
        address: factoryAddress,
        method: "currentTime",
        args: [],
      }]) ?? [];
      if (result && result[0]) {
        currentTime = result[0][0].toNumber();
        return children({
          currentTime
        });
      }
    } catch (e: unknown) {
      console.log(e);
      if(setErrors){
        if (e && e.toString().match(/call revert exception/)) {
          setErrors({ factoryAddress: ["Invalid factory address"] });
        }
      }
    }
  }
  return null;
};
