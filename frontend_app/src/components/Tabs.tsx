import { Nav, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import React from "react";

interface IProps {
  tab: string;
  setTab: (tabName: string) => void;
  items: { code: string, to: string, label: string }[];
}

export const Tabs = ({ tab, setTab, items }: IProps): JSX.Element => (
  <Nav pills className="mb-3 mx-1">
    {items.map((item, index) => <NavItem key={index}>
      <NavLink tag={Link} active={tab == item.code}
               onClick={() => setTab(item.code)}
               to={item.to + (index ? "?tab=" + item.code : "")}>
        {item.label}
      </NavLink>
    </NavItem>)}
  </Nav>
);
