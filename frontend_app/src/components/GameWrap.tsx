import React from "react";
import { utils } from "ethers";
import { ethers } from "ethers/lib.esm";
import { useContractCalls } from "@usedapp/core";
import TicTacToeERC20Abi from "../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import { GameStatusType } from "../types/game";

export const GameWrap = (props: {
  errors: any,
  children: (gameStatusData: GameStatusType) => React.ReactElement
  setErrors: (errors: any) => void;
  gameAddress: string;
}) => {
  const { children, gameAddress, setErrors } = props;

  let turnNumber: number = 0;
  let lastStepTime: number = 0;
  let currentTurn: number = 0;
  let status: number = 0;
  let player2: string = "";

  if (gameAddress && ethers.utils.isAddress(gameAddress)) {
    try {
      const result = useContractCalls([{
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "turnNumber",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "lastStepTime",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "currentTurn",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "status",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "player2",
        args: [],
      }]) ?? [];
      if (result && result[0] && result[1] && result[2] && result[3] && result[4]) {
        turnNumber = result[0][0].toNumber();
        lastStepTime = result[1][0].toNumber();
        currentTurn = result[2][0];
        status = result[3][0];
        player2 = result[4][0];
        return children({
          turnNumber,
          lastStepTime,
          currentTurn,
          status,
          player2,
        });
      }
    } catch (e: unknown) {
      console.log(e);
      if (e && e.toString().match(/call revert exception/)) {
        setErrors({ tokenAddress: ["Invalid game address"] });
      }
    }
  }
  return null;
};
