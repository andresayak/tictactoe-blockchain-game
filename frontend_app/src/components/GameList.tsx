import { Button, Table } from "reactstrap";
import { GameDataType, gameTypes } from "../types/game";
import Moment from "react-moment";
import { PlayTicTacToeModal } from "./modals/TicTacToe/PlayTicTacToeModal";
import { ConfigType } from "../redux/reducers/systemReducer";
import { Link } from "react-router-dom";
import { shortenAddress } from "@usedapp/core";
import { ethers } from "ethers/lib.esm";
import { TokenDataType } from "../types/token";
import React from "react";
import { TokenWrap } from "./TokenWrap";

type PropType = {
  items: GameDataType[];
  configs: ConfigType;
  account: string;
}

export const GameList = ({ items, configs, account }: PropType) => {
  return <Table>
    <thead>
    <tr>
      <th>Type</th>
      <th>Creator</th>
      <th>Bet</th>
      <th>Timeout</th>
      <th>Size</th>
      <th>Created At</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    {items.map((gameData, index) => {
      return <TokenWrap
        tokenAddress={gameData.tokenAddress} account={account}
        spenderAddress={gameData.address} children={(tokenData?: TokenDataType) => {
        if (!tokenData) {
          return <div></div>;
        }
        return <tr key={index}>
          <td>
            {gameData.type !== undefined ? gameTypes[gameData.type] : "--"}
          </td>
          <td>
            <span title={gameData.creatorAddress}>{shortenAddress(gameData.creatorAddress)}</span>
          </td>
          <td>
            {ethers.utils.formatUnits(gameData.params.coins, tokenData.decimals)}{" "}{tokenData.name} ({tokenData.symbol})
          </td>
          <td>
            {gameData.params.timeoutTime}
          </td>
          <td>
            {gameData.params.size}
          </td>
          <td>
            <Moment date={gameData.createdAt} fromNow />
            <div className="small">
              <Moment date={gameData.createdAt} />
            </div>
          </td>
          <td className="text-end">
            <Button tag={Link} to={"/game/" + gameData.address} color="light" className="me-2">View</Button>
            <PlayTicTacToeModal game={gameData} configs={configs} />
          </td>
        </tr>;
      }} />;
    })}
    </tbody>
  </Table>;
};
