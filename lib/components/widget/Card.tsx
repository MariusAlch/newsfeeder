import axios from "axios";
import moment from "moment";
import { useContext, useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { FiCheck, FiSend } from "react-icons/fi";
import { Post, WidgetInfo } from "../../../shared/data.model";
import { WidgetContainer } from "../../containers/widget.container";
import { getClientConfig } from "../../util/client-config";
import { widgetGlobalStyle } from "../../util/mount-widget-style";
import { styled } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";
import { PostContainer, PostContent, PostTitle } from "./Post.components";

const ReactImage = styled.img<{ rated: boolean; selected: boolean }>`
  height: 25px;
  width: 25px;

  transition: all 0.2s ease;

  filter: ${p => (p.rated && !p.selected ? "grayscale(1)" : "saturate(1.25)")};
`;

const ReactImageContainer = styled.div<{}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 33px;
  width: 33px;
  cursor: pointer;

  :hover img {
    height: 33px;
    width: 33px;
  }
`;

const ReactFeedback = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Bottom = styled.div`
  padding-top: 8px;
  padding-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Date = styled.div`
  font-size: 12px;
  color: #9598a4;
`;

const Input = styled(TextareaAutosize)`
  flex-grow: 1;
  border: none;
  outline: none;
  resize: none;
  color: ${p => p.theme.colors.font};
  ::placeholder {
    color: #9598a4;
  }
  padding: 0px;

  font-family: "Open Sans", sans-serif;
  line-height: 1.75;
  font-size: 14px;
`;

const CommentSection = styled.div`
  margin: 0px -12px;
  border-top: 1px solid #ebebeb;
  padding: 12px 12px;
  display: flex;
  align-items: flex-end;
`;

const SendButton = styled(FiSend)<{ disabled: boolean }>`
  padding-bottom: 2px;
  padding-left: 4px;
  color: ${p => p.theme.colors.font};
  cursor: pointer;

  ${p =>
    p.disabled &&
    `
    cursor: not-allowed;
    color: #cacaca;
  `}
`;

const Thanks = styled.div`
  font-weight: 600;
  width: 100%;
  text-align: center;
  font-size: 14px;
  padding: 4px 0px;
`;

interface Props {
  post: Post;
}
export const Card: React.FunctionComponent<Props> = props => {
  const widgetContainer = useContext(WidgetContainer.Context);
  const feedback = widgetContainer.widgetInfo.feedbacks.find(_ => _.post === props.post._id);
  const rating = feedback && Number.isInteger(feedback.value) ? feedback.value : null;

  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  function onRating(value: number) {
    axios
      .post<WidgetInfo>(`${getClientConfig().API_URL}/api/posts/rating`, {
        value,
        name: widgetContainer.widgetConfig.name,
        postId: props.post._id,
      })
      .then(resp => widgetContainer.setWidgetInfo(resp.data));
  }

  function onComment() {
    if (comment.trim().length === 0) {
      return;
    }

    setSent(true);
    axios.post<WidgetInfo>(`${getClientConfig().API_URL}/api/posts/comment`, {
      text: comment,
      name: widgetContainer.widgetConfig.name,
      postId: props.post._id,
    });
  }

  function onCommentChange(text: string) {
    if (text.length > 500) {
      return;
    }
    setComment(text);
  }

  const parser = new DOMParser();

  function addZoomableImages(htmlString: string) {
    const document = parser.parseFromString(htmlString, "text/html");

    document.querySelectorAll("img").forEach(image => {
      image.replaceWith(getZoomWrapper(image));
    });

    return document.body.innerHTML;
  }

  function getZoomWrapper(img: HTMLImageElement) {
    const container = document.createElement("div");
    container.className = widgetGlobalStyle.classes.zoomContainer;
    container.style.width = "100%";
    container.style.overflow = "hidden";
    container.style.cursor = "pointer";
    container.style.position = "relative";

    const imgClone = img.cloneNode() as HTMLImageElement;
    imgClone.className = "zoom-image";
    imgClone.style.transition = "transform 0.5s ease";
    imgClone.style.verticalAlign = "middle";

    const zoomIcon = document.createElement("div");
    zoomIcon.classList.add(widgetGlobalStyle.classes.zoomIcon);
    zoomIcon.classList.add("zoom-icon");
    zoomIcon.style.position = "absolute";
    zoomIcon.style.backgroundColor = "rgba(0,0,0,0.6)";
    zoomIcon.style.borderRadius = "4px";
    zoomIcon.style.height = "28px";
    zoomIcon.style.width = "28px";
    zoomIcon.style.top = "8px";
    zoomIcon.style.right = "8px";
    zoomIcon.style.transition = "opacity 0.5s ease";
    zoomIcon.style.boxShadow = "rgba(0, 0, 0, 0.5) 0px 0px 10px";
    zoomIcon.style.display = "flex";
    zoomIcon.style.justifyContent = "center";
    zoomIcon.style.alignItems = "center";

    const zoomImg = document.createElement("img");
    zoomImg.src = `${getClientConfig().API_URL}/static/maximize.svg`;
    zoomImg.height = 20;
    zoomImg.width = 20;

    zoomIcon.appendChild(zoomImg);
    container.appendChild(imgClone);
    container.appendChild(zoomIcon);

    return container;
  }

  return (
    <PostContainer style={{ paddingBottom: 0 }}>
      <PostTitle>{props.post.title}</PostTitle>
      <PostContent html={addZoomableImages(props.post.content)} />
      <Bottom>
        <ReactFeedback>
          <ReactImageContainer onClick={() => onRating(1)}>
            <ReactImage
              rated={rating !== null}
              selected={rating === 1}
              src={`${getClientConfig().API_URL}/static/svg/happy.svg`}
            />
          </ReactImageContainer>
          <ReactImageContainer onClick={() => onRating(0)}>
            <ReactImage
              rated={rating !== null}
              selected={rating === 0}
              src={`${getClientConfig().API_URL}/static/svg/middle.svg`}
            />
          </ReactImageContainer>
          <ReactImageContainer onClick={() => onRating(-1)}>
            <ReactImage
              rated={rating !== null}
              selected={rating === -1}
              src={`${getClientConfig().API_URL}/static/svg/sad.svg`}
            />
          </ReactImageContainer>
        </ReactFeedback>
        <Date>{moment(props.post.scheduledDate).fromNow()}</Date>
      </Bottom>
      <CommentSection>
        <OptionalRender shouldRender={!sent}>
          <>
            <Input
              max={1000}
              value={comment}
              onChange={(e: any) => onCommentChange(e.target.value)}
              placeholder="Send us your feedback"
            />
            <SendButton onClick={onComment} disabled={comment.trim().length === 0} size={20} />
          </>
        </OptionalRender>
        <OptionalRender shouldRender={sent}>
          <Thanks>
            <FiCheck style={{ verticalAlign: "sub", paddingRight: 4 }} size={16} />
            Thanks for the feedback!
          </Thanks>
        </OptionalRender>
      </CommentSection>
    </PostContainer>
  );
};
