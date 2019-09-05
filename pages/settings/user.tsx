import { Plans } from "../../lib/components/Plans";
import { ProtectedPage } from "../../lib/components/ProtectedPage";
import { SettingsLayout } from "../../lib/components/SettingsLayout";

export default ProtectedPage(() => {
  return (
    <SettingsLayout>
      <Plans />
    </SettingsLayout>
  );
});
