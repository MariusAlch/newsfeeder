import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import Highlight from "react-highlight";
import { PageTitle, TopContent } from "../../lib/components/common.components";
import { Checkbox } from "../../lib/components/form/Checkbox";
import { OptionalRender } from "../../lib/components/OptionalRender";
import { ProtectedPage } from "../../lib/components/ProtectedPage";
import { SettingsLayout } from "../../lib/components/SettingsLayout";
import { WidgetButtonUI } from "../../lib/components/widget/WidgetButtonUI";
import { AgentContainer } from "../../lib/containers/agent.container";
import { styled } from "../../lib/util/styled";
import { Dashboard } from "../../shared/data.model";

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;
`;

const SettingsContainer = styled.div`
  display: flex;
  padding-top: 16px;
  padding-bottom: 32px;
`;

const SettingsSide = styled.div`
  width: 50%;
`;
const PreviewSide = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const Preview = styled.div<{ position: string }>`
  background-color: #f0f0f0;
  border-radius: 4px;
  flex-grow: 1;
  display: flex;
  justify-content: ${p => (p.position === "left" ? "flex-start" : "flex-end")};
  align-items: flex-end;
  padding: 32px;
`;

function getScript(companyId: string) {
  return `
<body>
  ...
  <script src="https://www.newsfeeder.io/newsfeeder.js?id=${companyId}"></script>
</body>
`.trim();
}
function getCustomButtonScript(companyId: string) {
  return `
<body>
  <button onclick="NewsFeeder.show()">Product updates</button>
  ...
  <script src="https://www.newsfeeder.io/newsfeeder.js?id=${companyId}"></script>
</body>
`.trim();
}

export default ProtectedPage(() => {
  const agentContainer = useContext(AgentContainer.Context);
  const [appearance, setAppearance] = useState({ position: "right", color: "#FFF" });

  useEffect(() => {
    if (agentContainer.dashboard) {
      const { color, position } = agentContainer.dashboard.company.widget;
      setAppearance({ color, position });
    }
  }, [agentContainer.dashboard && agentContainer.dashboard.company.widget.color]);

  function changeAppearance({ position, color }) {
    setAppearance({ position, color });
    axios
      .post<Dashboard>("/api/agents/customize-widget", { position, color })
      .then(() => agentContainer.refreshDashboard());
  }

  return (
    <SettingsLayout>
      <SettingsContainer>
        <SettingsSide>
          <Title>Button Display</Title>
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={appearance.position === "left"}
              onClick={() => changeAppearance({ color: appearance.color, position: "left" })}>
              Left
            </Checkbox>
            <Checkbox
              checked={appearance.position === "right"}
              onClick={() => changeAppearance({ color: appearance.color, position: "right" })}>
              Right
            </Checkbox>
            <Checkbox
              checked={appearance.position === "hide"}
              onClick={() => changeAppearance({ color: appearance.color, position: "hide" })}>
              Hide
            </Checkbox>
          </div>
          <Title>Color</Title>
          <div style={{ overflow: "hidden", width: "fit-content" }}>
            <CompactPicker
              color={appearance.color}
              onChange={clr => changeAppearance({ color: clr.hex, position: appearance.position })}
            />
          </div>
        </SettingsSide>
        <PreviewSide>
          <Title>Preview</Title>
          <Preview position={appearance.position}>
            <OptionalRender shouldRender={appearance.position !== "hide"}>
              <WidgetButtonUI color={agentContainer.dashboard.company.widget.color} />
            </OptionalRender>
          </Preview>
        </PreviewSide>
      </SettingsContainer>
      <Title style={{ marginTop: 24 }}>Add widget to your website</Title>
      <p>Add script to the bottom of of the body tag of your website</p>
      <Highlight className="html">{getScript(agentContainer.dashboard.company._id)}</Highlight>
      <Title>Custom Button</Title>
      <Highlight className="html">{getCustomButtonScript(agentContainer.dashboard.company._id)}</Highlight>
      <p>
        Make sure <b>NewsFeeder.init</b> is called before <b>NewsFeeder.show</b>
      </p>
    </SettingsLayout>
  );
});
