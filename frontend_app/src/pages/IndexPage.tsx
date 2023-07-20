import React from "react";
import { connect } from "react-redux";
import { CreateTicTacToeModal } from "../components/modals/CreateTicTacToeModal";
import { Col, Row } from "reactstrap";
import { ConfigType } from "../redux/reducers/systemReducer";

const Component = (props:any) => {
  console.log('props', props);
  const {configs}: {configs:ConfigType} = props;
  return <div className="mt-5 py-5">
    <Row>
      <Col sm={6}>
        <CreateTicTacToeModal configs={configs}/>
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
