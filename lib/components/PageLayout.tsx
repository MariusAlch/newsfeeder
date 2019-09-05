import Link from "next/link";
import { useContext, useEffect } from "react";
import Drift from "react-driftjs";
import { AgentContainer } from "../containers/agent.container";
import { styled } from "../util/styled";
import { AccountTooltip } from "./AccountTooltip";
import { ConfirmEmailAlert } from "./ConfirmEmailAlert";
import { FullScreenLoader } from "./FullScreenLoader";
import { PreviewWidget } from "./PreviewWidget";

const Root = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 1100px;
`;

const Content = styled.div<{ fullWidth: boolean }>`
  width: 100%;
  position: relative;
  flex-grow: 1;
  padding: 0px 8px 150px 8px;

  ${p =>
    !p.fullWidth &&
    `
    max-width: 1100px;
    margin: 0px auto;
  `}
`;

const HeaderContainer = styled.div`
  width: 100%;
  background: linear-gradient(57deg, #474af4 0%, #1e4d92 100%);
`;
const Header = styled.div`
  padding: 0px 8px;
  width: 100%;
  max-width: 1100px;
  height: 70px;
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LinkButton = styled.a<{ enabled: boolean }>`
  & + * {
    margin-left: 8px;
  }
  color: #fff;
  font-weight: 600;
  padding: 6px 12px;
  cursor: pointer;
  :hover {
    background-color: #ffffff22;
  }
  ${p =>
    p.enabled &&
    `
    background-color: #ffffff22;
  `}
  border-radius: 3px;
`;

const Logo = styled.img`
  height: 35px;
  margin-right: 24px;
  cursor: pointer;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PageLayout: React.FunctionComponent<{ fullWidth?: boolean }> = props => {
  const agentContainer = useContext(AgentContainer.Context);

  useEffect(() => {
    agentContainer.refreshDashboard();
  }, []);

  if (!(agentContainer.dashboard && agentContainer.dashboard.agent)) {
    return <FullScreenLoader />;
  }

  return (
    <Root>
      <Drift
        appId="754cg2t2m5up"
        attributes={{
          email: agentContainer.dashboard.agent.email,
        }}
      />
      <HeaderContainer>
        <Header>
          <NavContainer>
            <Link href="/announcements">
              <Logo src="/static/logo.svg" alt="" />
            </Link>
          </NavContainer>
          <div>
            <Link href="/announcements">
              <LinkButton enabled={location.pathname === "/announcements"}>Announcements</LinkButton>
            </Link>
            <Link href="/settings/widget">
              <LinkButton enabled={location.pathname.includes("/settings")}>Settings</LinkButton>
            </Link>
          </div>
          <AccountTooltip>
            <LinkButton enabled={false}>{agentContainer.dashboard.agent.email}</LinkButton>
          </AccountTooltip>
        </Header>
      </HeaderContainer>
      <PreviewWidget />
      <Content fullWidth={!!props.fullWidth}>
        <ConfirmEmailAlert />
        {props.children}
      </Content>
    </Root>
  );
};
