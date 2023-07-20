import React from "react";

interface IProps{
  title: string;
}
export const PageTitle = ({title}: IProps) => (
  <div className="mb-4 px-2">
    <div>
      <h3>{title}</h3>
    </div>
  </div>
);
