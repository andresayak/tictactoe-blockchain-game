import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export function WrongNetworkModal() {

  return (
    <div>
      <Modal isOpen={true}>
        <ModalHeader>Wrong network</ModalHeader>
        <ModalBody>
          Please use Binance Smart Chain Mainnet or Testnet.
        </ModalBody>
      </Modal>
    </div>
  );
}
