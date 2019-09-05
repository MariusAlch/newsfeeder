import axios from "axios";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import swal from "sweetalert2";
import { PlanType } from "../../shared/data.model";
import { AgentContainer } from "../containers/agent.container";
import { styled } from "../util/styled";
import { AbsoluteLoader } from "./AbsoluteLoader";
import { Button } from "./form/Button";
import { OptionalRender } from "./OptionalRender";

const Cards = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  color: ${p => p.theme.colors.font};
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;

const Card = styled.div<{ selected: boolean }>`
  cursor: pointer;
  width: 300px;
  border-radius: 4px;
  border: solid 2px #e9e7e7;
  padding: 16px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  & + * {
    margin-left: 16px;
  }

  ${p =>
    p.selected &&
    `
    border: solid 2px ${p.theme.colors.primary};
  `}
`;

const Features = styled.div``;

const Feature = styled.div`
  text-align: left;
  padding: 8px;
`;

const Price = styled.div`
  text-align: center;
  font-size: 66px;
  font-weight: 700;
`;

const PriceSection = styled.div``;
const Billing = styled.div`
  text-align: center;
  color: #a9a9a9;
  font-size: 14px;
  margin-bottom: 4px;
  margin-top: -4px;
`;

const Root = styled.div`
  position: relative;
  overflow: hidden;
`;

const ButtonPosition = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

export const Plans: React.FunctionComponent = () => {
  const agentContainer = useContext(AgentContainer.Context);

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(agentContainer.dashboard.company.planType);

  useEffect(() => {
    setSelectedPlan(agentContainer.dashboard.company.planType);
  }, [agentContainer.dashboard.company.planType]);

  async function upgrade() {
    const { data } = await axios.post("/api/agents/upgrade-subscription");
    if (data.action === "payment") {
      Router.push("/payment");
    } else {
      agentContainer.refreshDashboard();
    }
  }
  async function downgrade() {
    const confirmation = await swal.fire({
      title: "Are you sure?",
      text: "Plan will be changed immediately",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#224ca8",
      confirmButtonText: "Change Plan",
      reverseButtons: true,
    });

    if (!!confirmation.dismiss) {
      return;
    }

    setLoading(true);
    await axios.post("/api/agents/cancel-subscription");
    await agentContainer.refreshDashboard();
    setLoading(false);
    await swal.fire({
      title: "Subscription Changed",
      type: "success",
      confirmButtonColor: "#224ca8",
    });
  }

  async function onSubscriptionChange() {
    if (selectedPlan === "growth") {
      upgrade();
    } else {
      downgrade();
    }
  }

  return (
    <Root>
      <OptionalRender shouldRender={loading}>
        <AbsoluteLoader />
      </OptionalRender>
      <Cards>
        <Card onClick={() => setSelectedPlan("start")} selected={selectedPlan === "start"}>
          <PriceSection>
            <Price>Free</Price>
            <Billing>&nbsp;</Billing>
          </PriceSection>
          <Title>Start</Title>
          <Features>
            <Feature>
              <FiCheck /> Unlimited posts
            </Feature>
            <Feature>
              <FiCheck /> Widget customization
            </Feature>
            <Feature>
              <FiCheck /> Emoji reactions, comments
            </Feature>
          </Features>
        </Card>
        <Card onClick={() => setSelectedPlan("growth")} selected={selectedPlan === "growth"}>
          <PriceSection>
            <Price>$ 9</Price>
            <Billing>Monthly</Billing>
          </PriceSection>
          <Title>Growth</Title>
          <Features>
            <Feature>
              <FiCheck /> Unlimited posts
            </Feature>
            <Feature>
              <FiCheck /> Widget Customization
            </Feature>
            <Feature>
              <FiCheck /> Emoji reactions, comments
            </Feature>
            <Feature>
              <FiCheck /> Post scheduling
            </Feature>
            <Feature>
              <FiCheck /> Remove NewsFeeder brand
            </Feature>
            <Feature>
              <FiCheck /> Priority support
            </Feature>
          </Features>
        </Card>
      </Cards>
      <ButtonPosition>
        <Button onClick={onSubscriptionChange} disabled={selectedPlan === agentContainer.dashboard.company.planType}>
          Change Subscription
        </Button>
      </ButtonPosition>
    </Root>
  );
};
