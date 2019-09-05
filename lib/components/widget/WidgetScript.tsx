import { ThemeProvider } from "emotion-theming";
import rug from "random-username-generator";
import React from "react";
import ReactDOM from "react-dom";
import { WidgetConfig } from "../../../shared/data.model";
import { WidgetContainer } from "../../containers/widget.container";
import { theme } from "../../util/styled";
import { PhotoPreview } from "../PhotoPreview";
import { RaiseTop } from "../RaiseTop";
import { BackgroundDim } from "./BackgroundDim";
import { LoadConfig } from "./LoadConfig";
import { Widget } from "./Widget";
import { WidgetButton } from "./WidgetButton";

declare global {
  interface Window {
    NewsFeederConfig: WidgetConfig;
    NewsFeeder: {
      show(): void;
      hide(): void;
    };
  }
}

const element = document.createElement("div");
element.id = "nf-mount";
document.body.appendChild(element);

function getGeneratedName() {
  const oldName = localStorage.getItem("nf-annonymous");
  if (!!oldName) {
    return oldName;
  }

  const name = rug.generate();
  localStorage.setItem("nf-annonymous", name);
  return name;
}

function parseCompanyId() {
  const node = document.querySelector<HTMLScriptElement>("[src*='/newsfeeder.js?id=']");
  if (!node) {
    return null;
  }
  return node.src.replace(/.*id=/, "");
}

main(typeof document !== "undefined");
function main(start: boolean) {
  if (!start) {
    return;
  }

  window.NewsFeeder = {} as any;

  mountApp();
}

function mountApp() {
  const companyId = parseCompanyId();
  if (!companyId) {
    // tslint:disable-next-line:no-console
    return console.error("Improper newsfeeder script setup");
  }

  const config: WidgetConfig = {
    name: getGeneratedName(),
    companyId,
    preview: false,
    ...(window.NewsFeederConfig || {}),
  } as WidgetConfig;

  ReactDOM.render(
    <WidgetContainer.Provider>
      <ThemeProvider theme={theme}>
        <LoadConfig config={config}>
          {() => (
            <RaiseTop>
              <WidgetButton />
              <BackgroundDim />
              <Widget />
              <PhotoPreview />
            </RaiseTop>
          )}
        </LoadConfig>
      </ThemeProvider>
    </WidgetContainer.Provider>,
    element,
  );
}
