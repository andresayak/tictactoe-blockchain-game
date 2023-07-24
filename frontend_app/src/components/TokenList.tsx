import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button, FormGroup, Input, Label } from "reactstrap";
import Scrollbars from "react-scrollbars-custom";
import { ethers } from "ethers/lib.esm";
import { TokenWrap } from "./TokenWrap";
import { useEthers } from "@usedapp/core";
import { tokenLists } from "../app";


export type TokenItemType = {
  chainId?: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

const addToRecentList = (chainId: number, token: TokenItemType) => {
  let items: TokenItemType[] = [];
  const recentListKey = "recentList" + chainId;
  const data = localStorage.getItem(recentListKey);
  if (data) {
    items = JSON.parse(data);
  }
  items = items.filter((item)=>item.address!=token.address);
  items = [token, ...items];

  console.log('items', items);
  localStorage.setItem(recentListKey, JSON.stringify(items));
};

export const RecentList = ({ selectToken, chainId }: {
  selectToken: (token: TokenItemType) => void,
  chainId: number
}) => {
  const [items, setItems] = useState<TokenItemType[]>([]);

  const recentListKey = "recentList" + chainId;

  useEffect(() => {
    const data = localStorage.getItem(recentListKey);
    console.log('data', data);
    if (data) {
      const items = JSON.parse(data);
      if (items) {
        setItems(items);
      }
    }
  }, [chainId]);

  return <div className="p-3">
    {items.map((token, index) => {
      return <React.Fragment key={index}>
        <Button onClick={()=>selectToken(token)} color="light" className="me-2">{token.symbol}</Button>
      </React.Fragment>;
    })}
  </div>;
};

export const RenderTokenItem = ({ token, selectToken }: {
  token: TokenItemType,
  selectToken: (token: TokenItemType) => void
}) => {
  return <div className="tokenList-item pt-1 pb-2" onClick={() => selectToken(token)}>
    <div className="px-3">
      <div className="d-flex">
        <div className="py-2">
          <div className="tokenList-icon">
            <img src={token.logoURI} />
          </div>
        </div>
        <div className="flex-fill px-4">
          <div className="h4 mb-0">{token.name}</div>
          <div>{token.symbol}</div>
        </div>
        <div className="text-end">
          {token.balance ?? "0.0"}
        </div>
      </div>
    </div>
  </div>;
};

export const TokenList = ({ spenderAddress, selectToken }: {
  spenderAddress: string,
  selectToken: (tokenAddress: string) => void
}) => {
  const { account, chainId } = useEthers();

  const [items, setItems] = useState<TokenItemType[]>([]);
  const [tokenValue, setTokenValue] = useState<string>("");

  const selectTokenAndSaveToRecent = (token: TokenItemType) => {
    if (chainId) {
      addToRecentList(chainId, token);
      selectToken(token.address);
    }
  };
  const fetchData = useCallback(() => {
    if (chainId) {
      const url = tokenLists[chainId];
      if (url) {
        axios.get(url).then(({ data }) => {
          console.log("data", data.tokens);
          setItems(data.tokens);
        });
      }
    }
  }, [chainId]);
  useEffect(() => {
    fetchData();
  }, [chainId]);

  if(!chainId){
    return null;
  }
  let filteredItems = items;
  if (tokenValue) {
    const matchValue = new RegExp(tokenValue.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"), "i");
    filteredItems = filteredItems.filter((item) => item.address.match(matchValue) || item.name.match(matchValue));
  }
  filteredItems = filteredItems.filter((item, index) => index < 100);
  return <>
    <div className="p-3 border-bottom">
      <FormGroup className="mr-1">
        <Label>Select a token</Label>
        <Input
          value={tokenValue} type="text" name="tokenAddress"
          placeholder="Search name or paste address"
          onChange={(e) => setTokenValue(e.currentTarget.value)} />
      </FormGroup>
    </div>
    <RecentList selectToken={selectTokenAndSaveToRecent} chainId={chainId} />
    <Scrollbars style={{ width: "100%", height: 300 }}>
      <div className="tokenList">
        {!filteredItems.length && ethers.utils.isAddress(tokenValue) ? <div>
          <TokenWrap account={account} spenderAddress={spenderAddress} tokenAddress={tokenValue}
                     children={(tokenData) => {
                       if (!tokenData) {
                         return <div className="p-3 text-center">token not found</div>;
                       }
                       return <RenderTokenItem selectToken={selectTokenAndSaveToRecent} token={{
                         address: tokenData?.address,
                         name: tokenData?.name,
                         symbol: tokenData?.symbol,
                         decimals: tokenData?.decimals,
                         balance: tokenData?.balance,
                       }} />;
                     }} />
        </div> : null}
        {filteredItems.map((token, index) => {
          return <React.Fragment key={index}>
            <RenderTokenItem selectToken={selectTokenAndSaveToRecent} token={token} />
          </React.Fragment>;
        })}
      </div>
    </Scrollbars>
  </>;
};
