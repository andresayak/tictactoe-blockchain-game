import React  from "react";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Input, Badge,
} from "reactstrap";
import { matchPath } from "react-router-dom";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { exploreRoutes, myRoutes } from "../routes";
import { useEthers, shortenAddress } from '@usedapp/core'
import { allowNetworks } from "../app";
import { WrongNetworkModal } from "./modals/WrongNetworkModal";
import { ConnectButton } from "./modals/ConnectButton";

export default (props: any) => {
  const location = useLocation();

  const items = [{
    label: "Explore",
    url: exploreRoutes.path,
    match: () => {
      return !!matchPath(exploreRoutes.path, location.pathname);
    },
  }, {
    label: "My games",
    url: myRoutes.path,
    match: () => {
      return !!matchPath(myRoutes.path, location.pathname);
    },
  }];
  const { account, chainId, deactivate, activateBrowserWallet } = useEthers();
  if (account && (!chainId || !allowNetworks[chainId])) {
    return <WrongNetworkModal/>
  }
  return <div className="border-bottom">
    <Navbar
      color="white"
      container
      expand="md"
      light
    >
      <NavbarBrand tag={Link} to="/">
        <img src="/assets/logo.svg" title="FreeToken" />
      </NavbarBrand>
      <Nav className="mr-auto order-sm-last w-sm-100" navbar>
        <div className="flex-fill form-search px-2 d-none d-sm-inline-block">
          <Input placeholder="Search ..." />
        </div>
          {account && (
            <NavItem>
              <Badge
                className="text-dark p-2 m-1"
                color="light"
              >
                {shortenAddress(account)}
              </Badge>
            </NavItem>
          )}
        <NavItem>
          <ConnectButton/>
        </NavItem>
      </Nav>
      <Nav className="me-auto" navbar>
        {items.map((item, key) => {
          const active = item.match();
          return <NavItem key={key}>
            <NavLink tag={Link} active={active} to={item.url}>
              {item.label}
            </NavLink>
          </NavItem>;
        })}
      </Nav>
    </Navbar>
  </div>;
}
