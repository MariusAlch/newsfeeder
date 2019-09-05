import { useContext, useEffect, useState } from "react";
import { WidgetContainer } from "../../containers/widget.container";

export const BackgroundDim: React.FunctionComponent<{}> = () => {
  const widgetContainer = useContext(WidgetContainer.Context);

  const [isDimmed, setIsDimmed] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsDimmed(widgetContainer.menuOpen));
  }, [widgetContainer.menuOpen]);

  return (
    <div
      style={{
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
        backgroundColor: "rgba(0, 0, 0, 0.3)",

        opacity: isDimmed ? 1 : 0,
        transition: "opacity 0.35s ease",

        pointerEvents: isDimmed ? "initial" : "none",
      }}
      onClick={() => widgetContainer.setMenuOpen(false)}
    />
  );
};
