import React, { useEffect } from "react";
import { connect } from "react-redux";
import { systemMainFetch } from "../redux/actions/systemActions";
import { useEthers } from "@usedapp/core";

const Component = (props: any) => {
  const { chainId } = useEthers();

  const { systemMainFetch} = props;
  useEffect(() => {
    if (chainId) {
        console.log('chainId' , chainId);
        systemMainFetch(chainId);
    }
  }, [chainId]);
  return <div className="d-flex flex-column h-100">
    {props.children}
  </div>;
};

const Connected = connect((store: any) => ({
}), (dispatch: any) => ({
  systemMainFetch: (chainId:number) => systemMainFetch(dispatch, chainId),
}))(Component);

const LandingLayout = (props: any) => {
  return <Connected {...props} />;
};
export default LandingLayout;
