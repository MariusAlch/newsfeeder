import { useContext, useEffect } from "react";
import { AgentContainer } from "../containers/agent.container";
import { FullScreenLoader } from "./FullScreenLoader";
import { OptionalRender } from "./OptionalRender";

export const LoadDashboard: React.FunctionComponent<{}> = props => {
  const agentContainer = useContext(AgentContainer.Context);

  useEffect(() => {
    agentContainer.refreshDashboard();
  }, []);

  if (!agentContainer.dashboard) {
    return <FullScreenLoader />;
  }
  return <OptionalRender shouldRender={!!agentContainer.dashboard}>{props.children}</OptionalRender>;
};
