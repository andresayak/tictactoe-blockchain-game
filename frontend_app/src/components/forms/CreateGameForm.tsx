import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import React from "react";

export const CreateGameForm = ({ tokenData, values, onChange, errors }: {
  tokenData: any,
  values: any,
  onChange: (col: string, value: any) => void,
  errors: any
}) => {
  const isError = (col: string): boolean => {
    return errors && typeof errors[col] == "object" && Object.values(errors[col]).length > 0 ? true : false;
  };
  const renderErrors = (col: string) => {
    // @ts-ignore
    return errors && errors[col] ? Object.values(errors[col]).map((value: string, index: number) => {
      return <FormFeedback key={index}>{value}</FormFeedback>;
    }) : null;
  };

  return <div>
    <FormGroup className="mr-1">
      <Label>Token</Label>
      <Input invalid={isError("tokenAddress")} value={values.tokenAddress} type="text" name="tokenAddress"
             onChange={(e) => onChange("tokenAddress", e.currentTarget.value)} />
      {renderErrors("tokenAddress")}
    </FormGroup>
    {tokenData ? <>
      <FormGroup className="mr-1">
        <div className="float-end small">Balance: {tokenData.balance} {tokenData.symbol}</div>
        <Label>Amount</Label>
        <Input invalid={isError("amount")} value={values.amount} type="number" min="1" name="amount"
               onChange={(e) => onChange("amount", e.currentTarget.value)} />
        {renderErrors("amount")}
      </FormGroup>
      <FormGroup className="mr-1">
        <Label>Board size</Label>
        <Input invalid={isError("size")} value={values.size} type="number" min="3" max="100" name="size"
               onChange={(e) => onChange("size", e.currentTarget.value)} />
        {renderErrors("size")}
      </FormGroup>
      <FormGroup className="mr-1">
        <Label>Step timeout</Label>
        <Input invalid={isError("timeout")} value={values.timeout} type="number" min="60" name="timeout"
               onChange={(e) => onChange("timeout", e.currentTarget.value)} />
        {renderErrors("timeout")}
      </FormGroup>
      <FormGroup className="mb-3 px-2">
        <Input id="agree_checkbox" type="checkbox" className="me-2" checked={values["agree"]}
               onChange={(e) => onChange("agree", e.currentTarget.checked)} />
        {" "}
        <Label check for="agree_checkbox">
          By checking this box, I agree to <a href="/terms" target="_blank">Terms of Service</a>
        </Label>
      </FormGroup>
    </> : null}
  </div>;
};
