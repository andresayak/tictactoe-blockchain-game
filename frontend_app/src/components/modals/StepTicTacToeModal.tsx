import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { StepGameForm } from "../forms/StepGameForm";
import { StepGameButton } from "../buttons/StepGameButton";

export function StepTicTacToeModal({ gameAddress }: { gameAddress: string }) {
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [values, setValues] = useState<any>({
    row: "1",
    col: "1",
  });
  const onChange = (col: string, value: string) => {
    setValues({ ...values, [col]: value });
    setErrors({ ...errors, [col]: undefined });
  };
  const toggle = () => setModal(!modal);
  return (
    <>
      <Button color="light" onClick={toggle}>
        Make Step
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Make Step a Tic Tac Toe Game</ModalHeader>
        <ModalBody>
          <StepGameForm onChange={onChange} values={values} errors={errors} />
        </ModalBody>
        <ModalFooter>
          <StepGameButton
            values={values}
            disabled={false}
            contractAddress={gameAddress}
            callback={() => {
              toggle();
            }} />
          <Button color="light" onClick={toggle} block>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
