import axios from "axios";
import throttle from "lodash/throttle";
import { useContext } from "react";
import { AgentContainer } from "../containers/agent.container";
import { sendToast } from "../util/send-toast";
import { styled } from "../util/styled";
import { OptionalRender } from "./OptionalRender";
import { SimpleLink } from "./SimpleLink";

const Warning = styled.div`
  background-color: #fefaf0;
  color: #c05621;
  border-left: 3px solid #ed8936;
  padding: 8px 16px;
  margin-bottom: 8px;
  max-width: 1100px;
  margin-top: 16px;
  margin-bottom: -8px;
`;

export const ConfirmEmailAlert: React.FunctionComponent<{}> = () => {
  const agentContainer = useContext(AgentContainer.Context);

  const sendVerification = throttle(async () => {
    await axios.post("/api/agents/verify/resend");
    sendToast(toaster => toaster.info({ message: "Email Verfication sent" }));
  }, 10000);

  return (
    <OptionalRender shouldRender={!agentContainer.dashboard.agent.verified}>
      <Warning>
        User email has not been verified, to enable all NewsFeeder features.{" "}
        <SimpleLink style={{ textDecoration: "underline" }} onClick={sendVerification}>
          Send verification again
        </SimpleLink>
      </Warning>
    </OptionalRender>
  );
};
