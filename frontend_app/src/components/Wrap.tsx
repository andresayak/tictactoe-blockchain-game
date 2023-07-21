import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loaderStart, loaderStop, loaderProgress, systemMainFetch } from "../redux/actions/systemActions";
import { useEthers } from "@usedapp/core";

const Component = (props: any) => {
  const { library, account, chainId } = useEthers();
  const { loaderStart, systemMainFetch, loaderProgress, loaderStop, loader, loader_progress } = props;
  useEffect(() => {
    const speed = 500;
    if (!props.loaded) {
      const attem = () => {
        loaderStart();
        systemMainFetch(chainId).then(() => {
          loaderProgress(50);
          setTimeout(() => {
            setTimeout(() => {
              loaderStop();
            }, speed);
          }, speed);
        }).catch((e: any) => {
          loaderStop();
          setTimeout(() => {
            window.location.reload();
          }, 30 * 1000);
        });
      };
      attem();
    }
  }, []);
  return <div className="d-flex flex-column h-100">
    {loader && <div id="page-loader">
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated"
             style={{ width: loader_progress + "%" }}></div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>}
    {props.children}
  </div>;
};

const Connected = connect((store: any) => ({
  loaded: store.system.loaded,
  loader: store.system.loader,
  loader_progress: store.system.loader_progress,
}), (dispatch: any) => ({
  loaderStart: () => loaderStart(dispatch),
  loaderStop: () => loaderStop(dispatch),
  loaderProgress: (progress: number) => loaderProgress(dispatch, progress),
  systemMainFetch: (chainId:number) => systemMainFetch(dispatch, chainId),
}))(Component);

const LandingLayout = (props: any) => {
  return <Connected {...props} />;
};
export default LandingLayout;
