import React from "react";
import {Container} from "reactstrap";
import {connect} from "react-redux";
import Navbar from "../components/Navbar";
import Wrap from "../components/Wrap";
import {Footer} from "../components/Footer";
import { useBlockNumber } from "@usedapp/core";

const Component = (props: any) => {
  const blockNumber = useBlockNumber();
  return <Wrap {...props}>
    <Navbar {...props} />
    <div className="wrapper-inner flex-fill w-100">
      <Container className="h-100 pb-3">
        {props.children}
      </Container>
    </div>
    <Footer/>
    blockNumber: {blockNumber}
  </Wrap>;
};

const Connected = connect((store: any) => ({
  configs: store.system.configs,
}), () => ({}))(Component);

const LandingLayout = (props: any) => {
  return <Connected {...props}/>
};
export default LandingLayout;
