import {FormFeedback} from "reactstrap";
import React from "react";

export const FormError = ({error}: { error: string | undefined }) => {
  return !!error ? <FormFeedback>{error}</FormFeedback> : null;
}
