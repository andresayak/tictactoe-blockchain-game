import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import ERC20TokenAbi from "../../contracts/ERC20.sol/ERC20.json";
import { BigNumber } from "ethers";

type PropType = {
  disabled?: boolean;
  allowanceBN: BigNumber;
  amountBN: BigNumber
  tokenAddress: string;
  spenderAddress: string;
  callback: (allowanceBN: BigNumber)=>void;
}
export const ApproveToken = (props: PropType) => {
  const { callback, disabled: forceDisabled = true, allowanceBN, amountBN, tokenAddress, spenderAddress } = props;
  const contract = new Contract(tokenAddress, ERC20TokenAbi.abi);
  const { state, send, events } = useContractFunction(contract, "approve");
  const [attems, setAttems] = useState<number>(0);

  let disabled = forceDisabled || allowanceBN.gte(amountBN);
  useMemo(() => {
    if (state.status == "Exception")
      if (state.errorMessage)
        toast.error(state.errorMessage);
    if (state.status == "Success" && events) {
      toast.success("Token Approved! ");
      callback(amountBN);
    }
  }, [state.status, attems, events]);

  return <Button color="primary" size={"lg"} block className="mr-1" disabled={state.status != "None" || disabled}
    onClick={() => {
      setAttems(attems + 1);
      send(spenderAddress, amountBN);
    }}>
    {state.status == "Mining" ? "Mining..." : "Approve"}
  </Button>;
};
