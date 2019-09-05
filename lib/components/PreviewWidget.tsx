import { useContext, useEffect, useState } from "react";
import { AgentContainer } from "../containers/agent.container";

export const PreviewWidget: React.FunctionComponent<{}> = () => {
  const agentContainer = useContext(AgentContainer.Context);

  const [lastToken, setLastToken] = useState(agentContainer.previewToken);

  useEffect(() => {
    if (agentContainer.previewToken === 0 || agentContainer.previewToken === lastToken) {
      return;
    }

    const libScript = document.createElement("script");
    libScript.className = "nf-preview";
    libScript.src = "/newsfeeder.js?id=demo";

    const configScript = document.createElement("script");
    configScript.className = "nf-preview";
    configScript.innerHTML = `window.NewsFeederConfig = {preview: true}`;

    document.body.appendChild(configScript);
    document.body.appendChild(libScript);

    setLastToken(agentContainer.previewToken);

    return () => {
      document.querySelectorAll(".nf-preview").forEach(_ => _.parentElement.removeChild(_));
      document.querySelectorAll(".nf-mount").forEach(_ => _.parentElement.removeChild(_));
      document.querySelectorAll(".nf-container").forEach(_ => _.parentElement.removeChild(_));
    };
  }, [agentContainer.previewToken]);

  return null;
};
