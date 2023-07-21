import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import React from "react";

export const StepGameForm = ({ values, onChange, errors }: {
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
      <Label>Row</Label>
      <Input invalid={isError("row")} value={values.row} type="number" min="0" name="row"
             onChange={(e) => onChange("row", e.currentTarget.value)} />
      {renderErrors("row")}
    </FormGroup>
      <FormGroup className="mr-1">
        <Label>Col</Label>
        <Input invalid={isError("col")} value={values.col} type="number" min="0" name="col"
               onChange={(e) => onChange("col", e.currentTarget.value)} />
        {renderErrors("col")}
      </FormGroup>
  </div>;
};
