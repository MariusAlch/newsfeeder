import { SyncLoader } from "react-spinners";
import { styled } from "../util/styled";

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

export const AbsoluteLoader: React.FunctionComponent<{}> = () => {
  return (
    <Root>
      <SyncLoader color={"#CCC"} />
    </Root>
  );
};
