import { useEthers } from "@usedapp/core";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  if (account) return <Button onClick={() => deactivate()} color={"danger nav-btn"} className="border-0">
    <span className="mr-1"><FontAwesomeIcon icon={faWallet} /></span> Disconnect
  </Button>;
  return <Button onClick={() => activateBrowserWallet()} color={"success nav-btn"} className="border-0">
    <span className="mr-1"><FontAwesomeIcon icon={faWallet} /></span> Connect wallet
  </Button>;
}
