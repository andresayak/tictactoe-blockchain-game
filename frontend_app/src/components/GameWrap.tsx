import React from "react";
import { utils } from "ethers";
import { ethers } from "ethers/lib.esm";
import { useContractCalls } from "@usedapp/core";
import TicTacToeERC20Abi from "../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import { GameStatusType } from "../types/game";

export const GameWrap = (props: {
  errors: any,
  children: (gameStatusData?:GameStatusType)=>React.ReactElement
  setErrors: (errors: any) => void;
  gameAddress: string;
}) => {
  const { children, gameAddress, setErrors } = props;

  let turnNumber: number = 0;
  let lastStepTime: number = 0;
  let currentTurn: number = 0;
  let status: number = 0;
  let coins: number = 0;
  let tokenAddress: string = '';
  let player1: string = '';
  let player2: string = '';
  let size: number = 0;
  let timeout: number = 0;
  let currentTime: number = 0;

  if(gameAddress && ethers.utils.isAddress(gameAddress)) {
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
        method: "token",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "coins",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "player1",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "player2",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "size",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "timeoutTime",
        args: [],
      }, {
        abi: new utils.Interface(TicTacToeERC20Abi.abi),
        address: gameAddress,
        method: "currentTime",
        args: [],
      }]) ?? [];
      if (result && result[0] && result[1]
        && result[2] && result[3] && result[4]
        && result[5] && result[6] && result[7]
        && result[8] && result[9] && result[10]
      ) {
        turnNumber = result[0][0].toNumber();
        lastStepTime = result[1][0].toNumber();
        currentTurn = result[2][0];
        status = result[3][0];
        tokenAddress = result[4][0];
        coins = result[5][0];
        player1 = result[6][0];
        player2 = result[7][0];
        size = result[8][0];
        timeout = result[9][0];
        currentTime = result[10][0];//.toNumber();
        return children({
          turnNumber,
          lastStepTime,
          currentTurn,
          status,
          tokenAddress,
          coins,
          player1,
          player2,
          size,
          timeout,
          currentTime
        });
      }
    } catch (e: unknown) {
      console.log(e)
      if (e && e.toString().match(/call revert exception/)) {
        setErrors({ tokenAddress: ["Invalid game address"] });
      }
    }
  }
  return children();
};
