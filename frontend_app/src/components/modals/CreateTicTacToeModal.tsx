import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { ConfigType } from "../../redux/reducers/systemReducer";
import { ApproveToken } from "../forms/ApproveToken";
import { GameCreateForm } from "../forms/GameCreateForm";
import { TokenDataType } from "../../types/token";
import { TokenWrap } from "../TokenWrap";
import { CreateGameButton } from "../buttons/CreateGameButton";
import { createBN } from "../../helpers/createBN";
import { LogDescription } from "ethers/lib/utils";
import { useNavigate } from "react-router-dom";

export function CreateTicTacToeModal({ configs }: { configs: ConfigType }) {
  const navigate = useNavigate();
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [modal, setModal] = useState(false);
  const [allowanceBN, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const [errors, setErrors] = useState<any>({});
  const [values, setValues] = useState<any>({
    amount: "1",
    tokenAddress: "",
    timeout: "60",
    size: "3",
    agree: false,
  });
  const onChange = (col: string, value: string) => {
    setValues({ ...values, [col]: value });
    setErrors({ ...errors, [col]: undefined });
  };
  const toggle = () => setModal(!modal);
  const amountBN = createBN(values.amount, values.decimals);
  return (
    <>
      <Button color="light" onClick={toggle}>
        Create Tic Tac Toe Gam
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Creating a Tic Tac Toe Game</ModalHeader>
        <TokenWrap
          tokenAddress={values.tokenAddress} account={account} errors={errors} setErrors={setErrors}
          spenderAddress={configs.FACTORY_ADDRESS} children={(tokenData?: TokenDataType)=>{
          const currentAllowanceBN = !tokenData || allowanceBN.gt(tokenData.allowanceBN)?allowanceBN:tokenData.allowanceBN;
          return <>
            <ModalBody>
              <GameCreateForm onChange={onChange} values={values} errors={errors} tokenData={tokenData} />
            </ModalBody>
            <ModalFooter>
              {tokenData && <>
                <ApproveToken
                  allowanceBN={currentAllowanceBN}
                  tokenAddress={values.tokenAddress}
                  spenderAddress={configs.FACTORY_ADDRESS}
                  amountBN={amountBN}
                  callback={(value)=>setAllowance(value)} />
                <CreateGameButton
                  disabled={currentAllowanceBN.lt(amountBN)}
                  contractAddress={configs.FACTORY_ADDRESS}
                  callback={(event:LogDescription)=>{
                    const gameAddress = event.args.game;
                    toggle();
                    navigate('/game/'+gameAddress);
                  }}
                  values={values} />
              </>}
              <Button color="light" onClick={toggle} block>Cancel</Button>
            </ModalFooter></>
        }}/>
      </Modal>
    </>
  );
}
