import { useContractFunction, useEthers } from "@usedapp/core";
import React, { useCallback, useMemo, useState } from "react";
import { Contract } from "ethers";
import TicTacToeERC20 from "../../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { GameType } from "../../types/game";

export const StepGameButton = (props: {
  values: any;
  callback: () => void;
  contractAddress: string;
  disabled: boolean
}) => {
  const { callback, values, disabled, contractAddress } = props;
  const { library, account, chainId } = useEthers();
  const [loading, setLoading] = useState<boolean>(false);
  const contract = new Contract(contractAddress, TicTacToeERC20.abi);
  const { state, send, events } = useContractFunction(contract, "step");
  const [attems, setAttems] = useState<number>(0);

  useMemo(() => {
    if (state.status == "Exception")
      if (state.errorMessage)
        toast.error(state.errorMessage);
    if (state.status == "Success" && events) {
      toast.success("Game Started! ");
      callback();
    }
  }, [state.status, attems, events]);

  const createGame = useCallback(
    async (...args: any[]) => {
      console.log('values', values);
      await send(values.row, values.col);
    },
    [library, values, contractAddress, state.status, attems, events],
  );

  if (state.status == "Success") {
    return <Button color="primary" size={"lg"} block className="mr-1" disabled={true}>Finished</Button>;
  }

  return <Button
    color="primary" size={"lg"} block className="mr-1"
    disabled={state.status == "Mining" || disabled || loading} onClick={createGame}>


    {state.status == "Mining" ? "Mining..." : "Confirm"}
  </Button>;
};
