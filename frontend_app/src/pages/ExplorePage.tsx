import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { ConfigType } from "../redux/reducers/systemReducer";
import { PageTitle } from "../components/PageTitle";
import { Tabs } from "../components/Tabs";
import { GameList } from "../components/GameList";
import { GameDataType } from "../types/game";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { Loader } from "../components/Loader";

const tabs = [
  { code: "wait", to: "/explore", label: "Wait" },
  { code: "progress", to: "/explore", label: "Progress" },
  { code: "closed", to: "/explore", label: "Closed" },
];

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => {
    return Object.fromEntries(new URLSearchParams(search).entries());
  }, [search]);
}

const Component = ({configs}: {configs:ConfigType}) => {
  const { account, chainId } = useEthers();
  const query = useQuery();
  const defaultTab = 'wait';
  const currentTab = query['tab']?query['tab']:defaultTab;
  const [tab, setTab] = useState<string>(currentTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<GameDataType[]>([]);


  const fetchData = useCallback(()=>{
    setLoading(true);
    axios.get('/api/explore/'+chainId+'/'+tab).then(({data})=>{
      setItems(data.items);
    }).catch((reason)=>{
      toast.error(reason.message);
    }).finally(()=>setLoading(false));
  }, [tab, chainId]);
  useEffect(()=>{
    if(chainId){
      fetchData();
    }
  }, [
    tab, chainId
  ]);
  if(!chainId || !account){
    return <></>;
  }
  return <>
    <div className="mt-5 py-5">
      <div className="d-flex">
        <div className="flex-fill">
          <PageTitle title={"Blockchain Games"}/>
        </div>
        <div>
          <Loader isShow={loading}/>
        </div>
      </div>
      <Tabs tab={tab} setTab={setTab} items={tabs}/>
      <Row>
        <Col sm={12}>
          <GameList items={items} configs={configs} account={account}/>
        </Col>
      </Row>
    </div>
    </>;
};

const Connected = connect((store: any) => ({
  configs: store.system.configs,
}), {})(Component);

export const ExplorePage = (props: any) => {
  return <Connected {...props} />;
};
