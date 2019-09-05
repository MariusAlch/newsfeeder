import { css } from "@emotion/core";
import useComponentSize from "@rehooks/component-size";
import { useContext, useEffect, useRef, useState } from "react";
import { WidgetContainer } from "../../containers/widget.container";
import { styled, theme } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";

export const postContentCSS = css`
  color: ${theme.colors.font};
  font-family: "Open Sans", sans-serif;
  * {
    margin: 0px;
  }
  h1 {
    font-size: 2em;
    font-weight: 500;
  }
  h2 {
    font-size: 1.5em;
    font-weight: 500;
  }
  line-height: 1.75 !important;
  font-size: 14px;

  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 500;

  .ql-video {
    display: block;
    max-width: 100%;
  }
`;

const Root = styled.div`
  ${postContentCSS}
`;

const ReadMoreContainer = styled.div<{ expanded: boolean }>`
  max-height: 500px;
  overflow: hidden;
  position: relative;
  ${p =>
    p.expanded &&
    `
    max-height: 2000px;
  `}
  transition: all 2s ease;
`;

const Gradient = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 20%,
    rgba(255, 255, 255, 1) 100%
  );
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ShowMore = styled.div`
  color: ${p => p.theme.colors.font};
  font-family: "Open Sans", sans-serif;
  position: absolute;
  padding: 12px 0px;

  display: flex;
  justify-content: center;
  bottom: 0;
  right: 0;
  left: 0;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
`;

interface Props {
  html: string;
}

export const PostContent: React.FunctionComponent<Props> = props => {
  const widgetContainer = useContext(WidgetContainer.Context);
  const ref = useRef<HTMLDivElement>(null);
  const { height } = useComponentSize(ref);

  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    ref.current.querySelectorAll(".zoom-image").forEach((el: HTMLImageElement) => {
      el.parentElement.onclick = () => widgetContainer.setPreviewImage(el.src);
    });
  });
  const content = <Root ref={ref} dangerouslySetInnerHTML={{ __html: props.html }} />;

  return (
    <>
      <OptionalRender shouldRender={height > 600}>
        <ReadMoreContainer expanded={isExpanded}>
          {content}
          <OptionalRender shouldRender={!isExpanded}>
            <>
              <Gradient />
              <ShowMore onClick={() => setExpanded(true)}>Read More</ShowMore>
            </>
          </OptionalRender>
        </ReadMoreContainer>
      </OptionalRender>
      <OptionalRender shouldRender={height <= 600}>{content}</OptionalRender>
    </>
  );
};

export const postTitleCSS = css`
  color: ${theme.colors.font};
  font-family: "Open Sans", sans-serif;
  * {
    margin: 0px;
  }
  h1 {
    font-size: 2em;
    font-weight: 500;
  }
  h2 {
    font-size: 1.5em;
    font-weight: 500;
  }
  line-height: 1.75 !important;
  font-size: 14px;

  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 500;
`;

export const PostTitle = styled.div`
  color: ${p => p.theme.colors.font};
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const PostContainer = styled.div`
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #e9e7e7;
  background-color: #ffffff;
  margin: 12px;
  padding: 12px;
`;
