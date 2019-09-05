import { useContext } from "react";
import { WidgetContainer } from "../../containers/widget.container";
import { OptionalRender } from "../OptionalRender";
import { WidgetButtonUI } from "./WidgetButtonUI";

export const WidgetButton: React.FunctionComponent<{}> = () => {
  const widgetContainer = useContext(WidgetContainer.Context);
  const { width } = widgetContainer.windowSize;

  const padding = width > 500 ? 36 : 8;

  return (
    <OptionalRender
      shouldRender={
        widgetContainer.widgetInfo !== null &&
        widgetContainer.widgetInfo.company.widget.position !== "hide" &&
        !widgetContainer.widgetConfig.preview
      }>
      {() => (
        <WidgetButtonUI
          style={{
            position: "fixed" as any,
            bottom: `${padding}px`,
            right: widgetContainer.widgetInfo.company.widget.position === "right" ? `${padding}px` : "initial",
            left: widgetContainer.widgetInfo.company.widget.position === "left" ? `${padding}px` : "initial",
            border: "none",
            height: "52px",
            width: "52px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
          color={widgetContainer.widgetInfo.company.widget.color}
          onClick={() => widgetContainer.setMenuOpen(!widgetContainer.menuOpen)}
        />
      )}
    </OptionalRender>
  );
};
