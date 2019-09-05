import jss from "jss";
import nestedJss from "jss-plugin-nested";

jss.use(nestedJss());

export const widgetGlobalStyle = jss.createStyleSheet({
  zoomIcon: {
    opacity: 0,
  } as any,
  zoomContainer: {
    "&:hover": {
      "& > img": {
        transform: "scale(1.05)",
      },
      "& .zoom-icon": {
        opacity: "1",
      },
    },
  } as any,
});

export function mountWidgetStyle(document: Document) {
  const style = document.head.appendChild(document.createElement("style"));
  style.textContent = widgetGlobalStyle.toString();
}
