import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-simple-flex-grid";
import { Label } from "../../lib/components/common.components";
import { OptionalRender } from "../../lib/components/OptionalRender";
import { ProtectedPage } from "../../lib/components/ProtectedPage";
import { SettingsLayout } from "../../lib/components/SettingsLayout";
import { AgentContainer } from "../../lib/containers/agent.container";
import { styled } from "../../lib/util/styled";

const Value = styled.div`
  margin-bottom: 8px;
  margin-top: -5px;
`;

type Subscription = import("stripe").subscriptions.ISubscription;

export default ProtectedPage(() => {
  const agentContainer = useContext(AgentContainer.Context);

  const [subscription, setSubscription] = useState<Subscription>(undefined);

  useEffect(() => {
    axios.get<Subscription>("/api/agents/subscription").then(resp => {
      setSubscription(resp.data);
    });
  }, [agentContainer.refreshToken]);
  return (
    <SettingsLayout>
      <OptionalRender shouldRender={!!subscription}>
        {() => (
          <Row>
            <Col span={4}>
              <Label>
                Subscription {moment(subscription.trial_end * 1000).isAfter(moment()) ? "Trail" : "Period"} End
              </Label>
              <Value>{moment(subscription.current_period_end * 1000).format("MMMM Do YYYY, h:mm a")}</Value>
            </Col>
            <Col span={4}>
              <Label>
                Subscription {moment(subscription.trial_end * 1000).isAfter(moment()) ? "Trail" : "Period"} End
              </Label>
              <Value>{moment(subscription.current_period_end * 1000).format("MMMM Do YYYY, h:mm a")}</Value>
            </Col>
            <Col span={4}>
              <Label>
                Subscription {moment(subscription.trial_end * 1000).isAfter(moment()) ? "Trail" : "Period"} End
              </Label>
              <Value>{moment(subscription.current_period_end * 1000).format("MMMM Do YYYY, h:mm a")}</Value>
            </Col>
          </Row>
        )}
      </OptionalRender>
    </SettingsLayout>
  );
});
