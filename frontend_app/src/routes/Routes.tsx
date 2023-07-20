import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout";
import { page as pageRoutes } from "./index";

interface IRouteProps {
  children: undefined | Array<any>
  path: string,
  exact: boolean,
  component: any
}


const childRoutes = (Layout: any, routes: Array<any>, props: any = {}): any[] => {
  return routes.map(({ children, exact = false, path, component }: IRouteProps, index: number) => {
    return <Route key={index} path={path} element={<Layout {...props}>{component(props)}</Layout>}></Route>;
  });
};

export default () => (
  <BrowserRouter>
    <Routes>
      {[
        ...childRoutes(LandingLayout, pageRoutes),
      ]}
    </Routes>
  </BrowserRouter>
)
