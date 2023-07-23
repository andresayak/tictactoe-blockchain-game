import React from "react";
import { PageTitle } from "../components/PageTitle";
import {Helmet} from "react-helmet";


export const TermsPage = () => {
  return <div className="mt-5 py-5">
    <PageTitle title={"Terms of service"}/>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Terms of service</title>
    </Helmet>
  </div>;
};
