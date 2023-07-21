import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { ConfigType } from "../../redux/reducers/systemReducer";
import { ApproveToken } from "../forms/ApproveToken";
import { TokenDataType } from "../../types/token";
import { TokenWrap } from "../TokenWrap";
import { GameType } from "../../types/game";
import { PlayGameButton } from "../buttons/PlayGameButton";
import Moment from "react-moment";
import { ethers } from "ethers/lib.esm";
import { GameWrap } from "../GameWrap";

export function PlayTicTacToeModal({ configs, game }: { configs: ConfigType, game: GameType }) {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [modal, setModal] = useState(false);
  const [allowanceBN, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const [errors, setErrors] = useState<any>({});

  const toggle = () => setModal(!modal);
  const amountBN = BigNumber.from(game.amount);
  return (
    <>
      <Button color="primary" onClick={toggle}>
        Play Game
      </Button>
      <Modal isOpen={modal} size="lg" toggle={toggle}>
        <ModalHeader>Play a Tic Tac Toe Game</ModalHeader>
        {modal && <GameWrap
          setErrors={setErrors} errors={errors}
          gameAddress={game.address} children={()=>{
            return <TokenWrap
              tokenAddress={game.tokenAddress} account={account} errors={errors} setErrors={setErrors}
              spenderAddress={game.address} children={(tokenData?: TokenDataType)=>{
              const currentAllowanceBN = !tokenData || allowanceBN.gt(tokenData.allowanceBN)?allowanceBN:tokenData.allowanceBN;
              return <>
                <ModalBody>
                  <dl className="row">
                    <dt className="col-sm-3">Address</dt>
                    <dd className="col-sm-9">{game.address}</dd>
                  </dl>
                  <dl className="row">
                    <dt className="col-sm-3">Creator</dt>
                    <dd className="col-sm-9">{game.creator}</dd>
                  </dl>
                  <dl className="row">
                    <dt className="col-sm-3">Created</dt>
                    <dd className="col-sm-9">
                      <Moment date={game.createdAt} fromNow />
                      <div className='small'>
                        <Moment date={game.createdAt}/>
                      </div>
                    </dd>
                  </dl>
                  <dl className="row">
                    <dt className="col-sm-3">Bet</dt>
                    <dd className="col-sm-9">{ethers.utils.formatUnits(game.amount, game.tokenDecimals)} {game.token}</dd>
                  </dl>
                </ModalBody>
                <ModalFooter>
                  {tokenData && <>
                    <ApproveToken
                      allowanceBN={currentAllowanceBN}
                      tokenAddress={game.tokenAddress}
                      spenderAddress={game.address}
                      amountBN={amountBN}
                      callback={(value)=>setAllowance(value)} />
                    <PlayGameButton
                      disabled={currentAllowanceBN.lt(amountBN)}
                      callback={toggle}
                      game={game} />
                  </>}
                  <Button color="light" onClick={toggle} block>Cancel</Button>
                </ModalFooter></>
            }}/>
        }}/>}
      </Modal>
    </>
  );
}
