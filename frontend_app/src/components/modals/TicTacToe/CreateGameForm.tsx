import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import React, { useState } from "react";

const timeoutOptions = [
  {value: 60, label: '1 min'},
  {value: 3600, label: '1 hour'},
  {value: 3600 * 6, label: '6 hours'},
  {value: 3600 * 12, label: '12 hours'},
  {value: 3600 * 18, label: '18 hours'},
];
export const CreateGameForm = ({ tokenData, values, onChange, errors }: {
  tokenData: any,
  values: any,
  onChange: (col: string, value: any) => void,
  errors: any
}) => {
  const [customTimeout, setCustomTimeout] = useState(false);
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
    {tokenData ? <>
      <FormGroup className="mr-1">
        <div className="float-end small">Balance: {tokenData.balance} {tokenData.symbol}{' '}
          <a onClick={()=>onChange("amount", tokenData.balance)}>Max</a>
      </div>
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
        <Input invalid={isError("timeout")} value={customTimeout?'custom':values.timeout} type="select" name="timeout"
               onChange={(e) => {
                 setCustomTimeout(e.currentTarget.value == 'custom');
                 if(e.currentTarget.value != 'custom') {
                   onChange("timeout", e.currentTarget.value);
                 }
               }}>
          {timeoutOptions.map((item, index)=><option key={index} value={item.value}>{item.label}</option>)}
          <option>custom</option>
        </Input>
        {renderErrors("timeout")}
      </FormGroup>
      {customTimeout && <FormGroup className="mr-1">
        <Label>Step timeout (seconds)</Label>
        <Input autoFocus invalid={isError("timeout")} value={values.timeout} type="number" min="60" max="65535" name="timeout"
               onChange={(e) => onChange("timeout", e.currentTarget.value)} />
        {renderErrors("timeout")}
      </FormGroup>}
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
