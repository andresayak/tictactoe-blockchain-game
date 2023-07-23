import React, { useState } from "react";
import { connect } from "react-redux";
import { Alert, Col, Row, Table } from "reactstrap";
import { ConfigType } from "../redux/reducers/systemReducer";
import { PageTitle } from "../components/PageTitle";
import { useParams } from "react-router-dom";
import { ethers } from "ethers/lib.esm";
import { Page404 } from "./errors/Page404";
import { GameWrap } from "../components/GameWrap";
import { TokenDataType } from "../types/token";
import { TokenWrap } from "../components/TokenWrap";
import {
  getExplorerAddressLink,
  getExplorerTransactionLink, shortenAddress,
  shortenTransactionHash,
  useEthers,
  useLogs,
} from "@usedapp/core";
import { PlayTicTacToeModal } from "../components/modals/PlayTicTacToeModal";
import { CancelGameModal } from "../components/modals/CancelGameModal";
import { TimeoutGameModal } from "../components/modals/TimeoutGameModal";
import { Contract } from "@ethersproject/contracts";
import TicTacToeERC20Abi from "../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import { StepTicTacToeModal } from "../components/modals/StepTicTacToeModal";

const GAME_STATUS_WAIT = 0;
const GAME_STATUS_PROGRESS = 1;
const GAME_STATUS_FINISHED = 2;
const GAME_STATUS_CANCELED = 3;

const statuses = [
  'Wait player', 'Wait step', 'Finished', 'Canceled'
];
const sides = [
  'NONE', 'Player 1', 'Player 2'
]

const Component = ({configs}: {configs:ConfigType}) => {
  const { account, chainId } = useEthers();
  const { gameAddress } = useParams();
  const [errors, setErrors] = useState<any>({});
  if(!gameAddress || !ethers.utils.isAddress(gameAddress)){
    return <Page404/>
  }
  const logs = useLogs({
    contract: new Contract(gameAddress, TicTacToeERC20Abi.abi),
    event: 'GameStep',
    args: [],
  });
  console.log('logs', logs);
  return <>
    <div className="mt-5 py-5">
      <PageTitle title={"Blockchain Game Details"}/>
      {account?
      <GameWrap errors={errors} setErrors={setErrors} gameAddress={gameAddress} children={(gameStatusData)=>{
        console.log('gameStatusData', gameStatusData);
        if(!gameStatusData) {
          return <div></div>;
        }
        return <div></div>;
        /*return <TokenWrap
          tokenAddress={gameStatusData.tokenAddress} account={account} setErrors={setErrors}
          spenderAddress={gameAddress} children={(tokenData?: TokenDataType)=>{
          if(!tokenData) {
            return <div></div>;
          }
          return <Row>
            <Col sm={6}>
              <dl className="row">
                <dt className="col-sm-3">Type</dt>
                <dd className="col-sm-9">Tic Tac Toe</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Status</dt>
                <dd className="col-sm-9">
                  {statuses[gameStatusData?.status]}
                  {gameStatusData?.status != GAME_STATUS_WAIT?<>{' '}
                  Player{gameStatusData?.currentTurn}
                  </>:null}
                </dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Contract Address</dt>
                <dd className="col-sm-9">{gameAddress}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Player1</dt>
                <dd className="col-sm-9">
                  <a href={chainId?getExplorerAddressLink(gameStatusData.player1, chainId):''}>{shortenAddress(gameStatusData.player1)}</a>
                </dd>
              </dl>
              {gameStatusData?.status != GAME_STATUS_WAIT?<>
              <dl className="row">
                <dt className="col-sm-3">Player2</dt>
                <dd className="col-sm-9">
                  <a href={chainId?getExplorerAddressLink(gameStatusData.player2, chainId):''}>{shortenAddress(gameStatusData.player2)}</a>
                </dd>
              </dl>
              </>:null}
              <dl className="row">
                <dt className="col-sm-3">Bet</dt>
                <dd className="col-sm-9">
                  {ethers.utils.formatUnits(gameStatusData.coins, tokenData.decimals)}{' '}
                  <a href={chainId?getExplorerAddressLink(tokenData.address, chainId):''}>{tokenData.name} ({tokenData.symbol})</a>
                </dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Timeout</dt>
                <dd className="col-sm-9">{gameStatusData.timeout} sec.</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Size</dt>
                <dd className="col-sm-9">{gameStatusData?.size} x {gameStatusData?.size}</dd>
              </dl>
              {gameStatusData?.status == GAME_STATUS_WAIT?<>
                  <span className="me-2">
                    <PlayTicTacToeModal configs={configs} game={{
                      address: gameAddress,
                      token: tokenData.symbol,
                      tokenAddress: gameStatusData.tokenAddress,
                      tokenDecimals: tokenData.decimals,
                      amount: gameStatusData.coins.toString(),
                      creator: gameStatusData?.player1,
                      createdAt: new Date().getTime(),
                      lastStepAt: gameStatusData?.lastStepTime,
                      timeout: gameStatusData.timeout,
                      size: gameStatusData.size
                    }}/>
                  </span>
                  {gameStatusData.player1 == account ? <CancelGameModal gameAddress={gameAddress}/>:null}
                </>
              :null}
              lastStepTime: {gameStatusData?.lastStepTime}<br/>
              currentTime: {gameStatusData?.currentTime}<br/>
              {gameStatusData?.status == GAME_STATUS_PROGRESS && gameStatusData?.lastStepTime + gameStatusData?.timeout < gameStatusData?.currentTime?<>
                {gameStatusData.player1 == account ? <TimeoutGameModal gameAddress={gameAddress}/>:null}
              </>:null}
            </Col>
            <Col sm={6}>
                <h3>Steps</h3>
                <Table>
                  <tbody>
                  <tr>
                    <th>
                      Block
                    </th>
                    <th>
                      Tx
                    </th>
                    <th>
                      Side
                    </th>
                    <th>
                      Cell
                    </th>
                  </tr>
                  </tbody>
                  {logs && logs.value && logs.value.map((log)=><tr>
                    <td>
                      {log.blockNumber}
                    </td>
                    <td>
                      <a href={chainId?getExplorerTransactionLink(log.transactionHash, chainId):''}>{shortenTransactionHash(log.transactionHash)}</a>
                    </td>
                    <td>
                      Player{log.data.side}
                    </td>
                    <td>
                      {log.data.row} x {log.data.col}
                    </td>
                  </tr>)}
                </Table>
                <StepTicTacToeModal gameAddress={gameAddress}/>
            </Col>
          </Row>
          }}/>*/
      }}/>:<div>
          <Alert color="info">
            <h4 className="alert-heading">
              Connect your wallet!
            </h4>
            <p>If you don't have a wallet yet, you can select a provider and create one now.</p>
          </Alert>
        </div>}
    </div>
    </>;
};

const Connected = connect((store: any) => ({
  configs: store.system.configs,
}), {})(Component);

export const GamePage = (props: any) => {
  console.log('props', props);
  return <Connected {...props} />;
};
