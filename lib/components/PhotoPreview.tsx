import { useContext, useEffect, useState } from "react";
import { WidgetContainer } from "../containers/widget.container";
import { styled } from "../util/styled";

const Image = styled.img`
  max-height: 90vh;
  max-width: 80vw;
  min-width: 40vw;
`;

export const PhotoPreview: React.FunctionComponent<{}> = () => {
  const widgetContainer = useContext(WidgetContainer.Context);

  const [image, setImage] = useState(null);
  useEffect(() => {
    if (widgetContainer.previewImage) {
      setImage(widgetContainer.previewImage);
    }
  }, [widgetContainer.previewImage]);

  function onTransitionEnd() {
    if (!widgetContainer.previewImage && !!image) {
      setImage(widgetContainer.previewImage);
    }
  }

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0px",
        right: "0px",
        cursor: "pointer",
        bottom: "0px",
        left: "0px",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",

        opacity: !!widgetContainer.previewImage ? 1 : 0,
        transition: "opacity 0.35s ease",
        pointerEvents: !!widgetContainer.previewImage ? "initial" : "none",
      }}
      onClick={() => widgetContainer.setPreviewImage(null)}>
      <Image src={image} />
    </div>
  );
};
