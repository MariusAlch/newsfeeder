import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-simple-flex-grid";
import { AgentContainer } from "../containers/agent.container";
import { styled } from "../util/styled";
import { PageTitle, Separator, TopContent } from "./common.components";
import { OptionalRender } from "./OptionalRender";
import { PageLayout } from "./PageLayout";

const LinkButton = styled.a<{ active: boolean }>`
  color: ${p => p.theme.colors.darkGray};
  font-weight: 600;
  padding: 6px 0px;
  margin-bottom: 8px;
  display: block;
  cursor: pointer;
  :hover {
    color: ${p => p.theme.colors.primary};
  }
  ${p =>
    p.active &&
    `
    color: ${p.theme.colors.primary};
  `}
  font-size: 16px;
  border-radius: 3px;
`;

export const SettingsLayout: React.FunctionComponent<{}> = props => {
  const agentContainer = useContext(AgentContainer.Context);
  const [, setAppearance] = useState({ position: "right", color: "#FFF" });

  useEffect(() => {
    if (agentContainer.dashboard) {
      const { color, position } = agentContainer.dashboard.company.widget;
      setAppearance({ color, position });
    }
  }, [agentContainer.dashboard && agentContainer.dashboard.company.widget.color]);

  return (
    <PageLayout>
      <TopContent>
        <PageTitle>Settings</PageTitle>
      </TopContent>
      <Separator style={{ marginBottom: 20 }} />
      <OptionalRender shouldRender={agentContainer.isLoggedIn}>
        {() => (
          <>
            <Row>
              <Col style={{ paddingRight: 32 }} span={2}>
                <Link href="/settings/widget">
                  <LinkButton active={location.pathname === "/settings/widget"}>Widget</LinkButton>
                </Link>
                <Link href="/settings/subscription">
                  <LinkButton active={location.pathname === "/settings/subscription"}>Subscription</LinkButton>
                </Link>
                {/* <Link href="/settings/billing">
                  <LinkButton active={location.pathname === "/settings/billing"}>Billing</LinkButton>
                </Link> */}
              </Col>
              <Col span={10}>{props.children}</Col>
            </Row>
          </>
        )}
      </OptionalRender>
    </PageLayout>
  );
};
