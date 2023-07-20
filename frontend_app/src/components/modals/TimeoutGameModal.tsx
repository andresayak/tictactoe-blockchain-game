import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { TimeoutGameButton } from "../buttons/TimeoutGameButton";

export function TimeoutGameModal({ gameAddress }: { gameAddress: string }) {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <>
      <Button color="light" onClick={toggle}>
        Finished Game by timeout
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Confirm game finishing</ModalHeader>
        <ModalBody>
        </ModalBody>
        <ModalFooter>
          <TimeoutGameButton gameAddress={gameAddress} callback={toggle} />
          <Button color="light" onClick={toggle} block>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
