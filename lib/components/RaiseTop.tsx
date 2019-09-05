import React from "react";
import { useContext } from "react";
import ReactDOM from "react-dom";
import { WidgetContainer } from "../containers/widget.container";

export const RaiseTop: React.FunctionComponent<{}> = props => {
  useContext(WidgetContainer.Context);

  function getElement() {
    const oldElement = document.querySelector("#nf-container");

    if (!!oldElement && document.body.lastElementChild === oldElement) {
      return oldElement;
    }

    if (!!oldElement && document.body.lastElementChild !== oldElement) {
      document.body.removeChild(oldElement);
    }

    const element = document.createElement("div");
    element.id = "nf-container";
    element.setAttribute("style", "position: absolute; z-index: 2147483647");
    document.body.appendChild(element);
    return element;
  }

  return ReactDOM.createPortal(<>{props.children}</>, getElement());
};
