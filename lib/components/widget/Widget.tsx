import createCache from "@emotion/cache";
import { CacheProvider, css, Global } from "@emotion/core";
import jss from "jss";
import { useContext, useEffect, useState } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import ScrollLock from "react-scrolllock";
import useWindowSize from "react-use/lib/useWindowSize";
import { WidgetContainer } from "../../containers/widget.container";
import { mountWidgetStyle } from "../../util/mount-widget-style";
import { theme } from "../../util/styled";
import { Hooks } from "../Hooks";
import { OptionalRender } from "../OptionalRender";
import { WidgetContent } from "./WidgetContent";

jss
  .createStyleSheet({
    "@keyframes nf-show-feed": {
      from: { opacity: 0, transform: "translateX(10px)" },
      to: { opacity: 1, transform: "translateX(0px)" },
    } as any,
    "@keyframes nf-hide-feed": {
      from: { opacity: 1, transform: "translateX(0px)" },
      to: { opacity: 0, transform: "translateX(10px)" },
    } as any,
  })
  .attach();

export const Widget: React.FunctionComponent = () => {
  const widgetContainer = useContext(WidgetContainer.Context);

  const [isOpen, setIsOpen] = useState(false);
  const [wasOpenned, setWasOpenned] = useState(false);
  const { height, width } = useWindowSize();

  useEffect(() => {
    updateWidgetSize();
  }, [height, width]);
  useEffect(() => {
    if (widgetContainer.menuOpen) {
      setTimeout(() => setWasOpenned(true));
    }
  }, [widgetContainer.menuOpen || wasOpenned]);

  function updateWidgetSize() {
    const size = { height: window.innerHeight, width };
    if (JSON.stringify(size) !== JSON.stringify(widgetContainer.windowSize)) {
      widgetContainer.setWindowSize(size);
    }
  }

  const w = widgetContainer.windowSize.width > 500 ? 400 : widgetContainer.windowSize.width;
  const h = widgetContainer.windowSize.height;

  const frameStyle = {
    position: "fixed" as any,
    top: "0px",
    right: "0px",
    border: "none",
    width: w,
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,.2)",
    height: isOpen || widgetContainer.menuOpen ? h : 0,
    animationName: widgetContainer.menuOpen ? "nf-show-feed" : "nf-hide-feed",
    animationDuration: "0.35s",
    animationFillMode: "forwards",
  };

  return (
    <>
      <ScrollLock isActive={widgetContainer.menuOpen || isOpen} />
      <Frame onAnimationEnd={() => setIsOpen(widgetContainer.menuOpen)} style={frameStyle}>
        <FrameContextConsumer>
          {({ document }) => (
            <>
              <Hooks onMount={() => mountWidgetStyle(document)} />
              <CacheProvider value={createCache({ container: document.head })}>
                <>
                  <Global
                    styles={css`
                      @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");

                      body {
                        color: ${theme.colors.font};
                        font-family: "Open Sans", sans-serif;
                        margin: 0px;
                      }
                    `}
                  />
                  <OptionalRender shouldRender={widgetContainer.widgetInfo !== null}>
                    {() => <WidgetContent />}
                  </OptionalRender>
                </>
              </CacheProvider>
            </>
          )}
        </FrameContextConsumer>
      </Frame>
    </>
  );
};
