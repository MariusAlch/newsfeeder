import { useContext, useEffect } from "react";
import { WidgetConfig } from "../../../shared/data.model";
import { WidgetContainer } from "../../containers/widget.container";
import { OptionalRender } from "../OptionalRender";

export const LoadConfig: React.FunctionComponent<{ config: WidgetConfig }> = props => {
  const widgetContainer = useContext(WidgetContainer.Context);

  useEffect(() => {
    widgetContainer.setWidgetConfig(props.config);
  }, []);

  return <OptionalRender shouldRender={!!widgetContainer.widgetConfig}>{props.children}</OptionalRender>;
};
