import React from "react";
import { connect } from "react-redux";
import { CreateTicTacToeModal } from "../components/modals/TicTacToe/CreateTicTacToeModal";
import { Col, Row } from "reactstrap";
import { ConfigType } from "../redux/reducers/systemReducer";

const Component = (props: any) => {
  console.log("props", props);
  const { configs }: { configs: ConfigType } = props;
  return <div className="mt-5 py-5">
    <Row>
      <Col sm={6}>
        <div className="card-deck mb-3 text-center">
          <div className="card mb-4 box-shadow">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">any BEP20 (ERC20) tokens</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">Tic Tac Toe <small className="text-muted">Game</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>2 players</li>
                <li>3-100 cells board size</li>
                <li>1min - 18h step timeout</li>
                <li>Fee 2%</li>
              </ul>
              <CreateTicTacToeModal configs={configs} children={(onClick)=>
                <button onClick={onClick} type="button" className="btn btn-lg btn-block btn-outline-primary">Create a game</button>}/>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>;
};

const Connected = connect((store: any) => ({
  configs: store.system.configs,
}), {})(Component);

export const IndexPage = (props: any) => {
  return <Connected {...props} />;
};
