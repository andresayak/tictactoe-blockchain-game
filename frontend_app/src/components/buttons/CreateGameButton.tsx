import { useContractFunction, useEthers } from "@usedapp/core";
import React, { useCallback, useMemo, useState } from "react";
import { Contract } from "ethers";
import FactoryAbi from "../../contracts/Factory.sol/Factory.json";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { LogDescription } from "ethers/lib/utils";

export const CreateGameButton = (props: {
  callback: (event: LogDescription) => void;
  values: {
    timeout: string;
    tokenAddress: string;
    amount: string;
    size: string;
  }, disabled: boolean, contractAddress: string
}) => {
  const { callback, values, disabled, contractAddress } = props;
  const { library, account, chainId } = useEthers();
  const [loading, setLoading] = useState<boolean>(false);
  const contract = new Contract(contractAddress, FactoryAbi.abi);
  const { state, send, events } = useContractFunction(contract, "createGame");
  const [attems, setAttems] = useState<number>(0);

  useMemo(() => {
    if (state.status == "Exception")
      if (state.errorMessage)
        toast.error(state.errorMessage);
    if (state.status == "Success" && events) {
      toast.success("Game successfully created!");
      const event = events.find((event)=>event.name=='GameCreated');
      if(event)
        callback(event);
    }
  }, [state.status, attems, events]);

  const createGame = useCallback(
    async (...args: any[]) => {
      await send(values.timeout, values.tokenAddress, values.amount, values.size);
    },
    [library, values, state.status, attems, events],
  );

  if (state.status == "Success") {
    console.log('events', events);
    return <Button color="primary" size={"lg"} block className="mr-1" disabled={true}>Finished</Button>;
  }

  return <Button
    color="primary" size={"lg"} block className="mr-1"
    disabled={state.status == "Mining" || disabled || loading} onClick={createGame}>
    {state.status == "Mining" ? "Mining..." : "Confirm"}
  </Button>;
};
