import axios from "axios";
import createContainer from "constate";
import { useEffect, useState } from "react";
import { Dashboard } from "../../shared/data.model";

export enum AuthValidationStatus {
  Valid = "Valid",
  Invalid = "Invalid",
  Pending = "Pending",
}

export const AgentContainer = createContainer(() => {
  const [dashboard, setDashboard] = useState<Dashboard>(null);
  const [previewToken, setPreviewToken] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);

  function refreshDashboard() {
    setRefreshToken(refreshToken + 1);
  }

  useEffect(() => {
    if (refreshToken > 0) {
      axios.get("/api/agents/dashboard").then(resp => setDashboard(resp.data));
    }
  }, [refreshToken]);

  return {
    dashboard,
    refreshDashboard,
    refreshToken,
    previewToken,
    previewWidget: () => setPreviewToken(previewToken + 1),
    get isLoggedIn() {
      return dashboard !== null && !!dashboard.agent;
    },
  };
});
