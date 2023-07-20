import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { CancelGameButton } from "../buttons/CancelGameButton";

export function CancelGameModal({ gameAddress }: { gameAddress: string }) {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <>
      <Button color="light" onClick={toggle}>
        Cancel Game
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Confirm game cancellation</ModalHeader>
        <ModalBody>
        </ModalBody>
        <ModalFooter>
          <CancelGameButton gameAddress={gameAddress} callback={toggle} />
          <Button color="light" onClick={toggle} block>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
