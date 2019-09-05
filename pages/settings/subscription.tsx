import { Plans } from "../../lib/components/Plans";
import { ProtectedPage } from "../../lib/components/ProtectedPage";
import { SettingsLayout } from "../../lib/components/SettingsLayout";

export default ProtectedPage(() => {
  return (
    <SettingsLayout>
      <p style={{ textAlign: "center" }}>Change your plan at any time. Simply select the tier that's right for you.</p>
      <Plans />
    </SettingsLayout>
  );
});
