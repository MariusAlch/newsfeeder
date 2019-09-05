import { css } from "@emotion/core";
import { useEffect } from "react";
import { styled } from "../lib/util/styled";

const A = css`
  color: red;
`;

const Marius = styled.div`
  font-size: 20px;

  & + & {
    background-color: green;
  }
  ${A}
`;

export default () => {
  return (
    <div>
      <Marius>marius</Marius>
      <Marius>marius</Marius>
      <Marius>marius</Marius>
    </div>
  );
};
