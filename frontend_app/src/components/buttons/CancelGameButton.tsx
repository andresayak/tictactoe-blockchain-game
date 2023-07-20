import { useContractFunction, useEthers } from "@usedapp/core";
import React, { useCallback, useMemo, useState } from "react";
import { Contract } from "ethers";
import TicTacToeERC20 from "../../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import { toast } from "react-toastify";
import { Button } from "reactstrap";

export const CancelGameButton = (props: {
  callback: () => void;
  gameAddress: string
}) => {
  const { callback, gameAddress } = props;
  const { library, account, chainId } = useEthers();
  const [loading, setLoading] = useState<boolean>(false);
  const contract = new Contract(gameAddress, TicTacToeERC20.abi);
  const { state, send, events } = useContractFunction(contract, "cancel");
  const [attems, setAttems] = useState<number>(0);

  useMemo(() => {
    if (state.status == "Exception")
      if (state.errorMessage)
        toast.error(state.errorMessage);
    if (state.status == "Success" && events) {
      toast.success("Game Canceled! ");
      callback();
    }
  }, [state.status, attems, events]);

  const action = useCallback(
    async (...args: any[]) => {
      await send();
    },
    [library, gameAddress, state.status, attems, events],
  );

  if (state.status == "Success") {
    return <Button color="primary" size={"lg"} block className="mr-1" disabled={true}>Finished</Button>;
  }

  return <Button
    color="primary" size={"lg"} block className="mr-1"
    disabled={state.status == "Mining" || loading} onClick={action}>
    {state.status == "Mining" ? "Mining..." : "Confirm"}
  </Button>;
};
