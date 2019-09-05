import Tippy from "@tippy.js/react";
import axios from "axios";
import { useContext } from "react";
import { FiEye, FiLogOut } from "react-icons/fi";
import { AgentContainer } from "../containers/agent.container";
import { styled } from "../util/styled";

const TooltipContainer = styled.div`
  width: 150px;
`;
const TooltipButton = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  :hover {
    color: ${p => p.theme.colors.primary};
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: ${p => p.theme.colors.gray};
`;

export const AccountTooltip: React.FunctionComponent<{}> = props => {
  const agentContainer = useContext(AgentContainer.Context);

  return (
    <Tippy
      theme="light"
      hideOnClick={false}
      interactive={true}
      content={
        <TooltipContainer>
          <TooltipButton
            onClick={() => {
              agentContainer.previewWidget();
            }}>
            <FiEye style={{ marginRight: 8 }} /> Preview Feed
          </TooltipButton>
          <Separator />
          <TooltipButton
            onClick={() =>
              axios.post(`/api/agents/logout`, {}, { withCredentials: true }).then(() => {
                window.authChecked = false;
                location.href = "/";
              })
            }>
            <FiLogOut style={{ marginRight: 8 }} /> Logout
          </TooltipButton>
        </TooltipContainer>
      }>
      {props.children as any}
    </Tippy>
  );
};
