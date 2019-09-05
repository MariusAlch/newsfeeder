import createCache from "@emotion/cache";
import { CacheProvider, css, Global } from "@emotion/core";
import Frame, { FrameContextConsumer } from "react-frame-component";
import { getClientConfig } from "../../util/client-config";
import { styled } from "../../util/styled";

const InboxIcon = styled.img`
  position: fixed;
  left: 13px;
  top: 9px;
  pointer-events: none;
  height: 35px;
`;

const Container = styled.div`
  height: 100vh;
  :hover {
    filter: brightness(0.7);
  }
  transition: filter 0.2s ease;
`;

type Props = React.HTMLAttributes<HTMLIFrameElement>;
export const WidgetButtonUI: React.FunctionComponent<Props> = props => {
  const frameStyle = {
    border: "none",
    height: "52px",
    width: "52px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Frame style={{ ...frameStyle, ...props.style }}>
      <FrameContextConsumer>
        {({ document }) => (
          <CacheProvider value={createCache({ container: document.head })}>
            <>
              <Global
                styles={css`
                  body {
                    overflow: hidden;
                    cursor: pointer;
                    margin: 0px;
                  }
                `}
              />
              <Container style={{ borderRadius: 6, backgroundColor: props.color }} onClick={props.onClick} />
              <InboxIcon src={`${getClientConfig().API_URL}/static/icon-white.svg`} alt="" />
            </>
          </CacheProvider>
        )}
      </FrameContextConsumer>
    </Frame>
  );
};
