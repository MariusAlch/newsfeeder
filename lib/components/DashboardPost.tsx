import axios from "axios";
import moment from "moment";
import Link from "next/link";
import Router from "next/router";
import { useContext } from "react";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import swal from "sweetalert2";
import { Post } from "../../shared/data.model";
import { AgentContainer } from "../containers/agent.container";
import { sendToast } from "../util/send-toast";
import { styled } from "../util/styled";
import { FeedbackSummary } from "./FeedbackSummary";
import { OptionalRender } from "./OptionalRender";
import { SimpleLink } from "./SimpleLink";
import { PostContainer, PostContent, PostTitle } from "./widget/Post.components";

const Root = styled.div`
  padding: 8px 0px;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  & + & {
    margin-top: 40px;
  }
`;

const LeftSide = styled.div``;

const Preview = styled.div`
  position: relative;
  width: 450px;
  min-height: 175px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${p => p.theme.colors.font};
`;

const DetailsClick = styled.div<{ clickable: boolean }>`
  ${p =>
    p.clickable &&
    `
    cursor: pointer;
  `}
`;

export const DashboardPost: React.FunctionComponent<{ post: Post }> = props => {
  const [deleted, setDeleted] = useState(false);

  const timeToReleaase = moment.utc(props.post.scheduledDate).valueOf() - moment.utc().valueOf();

  async function onDelete() {
    const confirmation = await swal.fire({
      title: "Are you sure?",
      text: "Post will be deleted forever",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#224ca8",
      confirmButtonText: "Delete Post",
      reverseButtons: true,
    });

    if (!!confirmation.dismiss) {
      return;
    }

    await axios.post("/api/posts/delete", { postId: props.post._id });
    sendToast(toaster => toaster.info({ message: "Post successfully deleted" }));
    setDeleted(true);
  }
  const clickable = !location.pathname.includes("feedback");

  if (deleted) {
    return null;
  }

  return (
    <Root>
      <LeftSide>
        <DetailsClick
          clickable={clickable}
          onClick={() => {
            if (clickable) {
              Router.push({
                pathname: "/post-feedback",
                query: { postId: props.post._id },
              });
            }
          }}>
          <Title>
            <OptionalRender shouldRender={timeToReleaase > 0}>
              <b style={{ fontWeight: 600 }}>Scheduled for </b>
            </OptionalRender>
            {moment(props.post.scheduledDate).format("MMMM Do YYYY, h:mm a")}
          </Title>
          <FeedbackSummary post={props.post} />
        </DetailsClick>
        <div style={{ marginTop: 12 }}>
          <Link href={{ pathname: "/post-editor", query: { postId: props.post._id } }}>
            <SimpleLink style={{ marginRight: 8 }}>
              <FiEdit size={20} /> Edit
            </SimpleLink>
          </Link>

          <SimpleLink onClick={onDelete}>
            <FiTrash2 size={20} /> Delete
          </SimpleLink>
        </div>
      </LeftSide>
      <Preview>
        <PostContainer style={{ margin: 0 }}>
          <PostTitle>{props.post.title}</PostTitle>
          <PostContent html={props.post.content} />
        </PostContainer>
      </Preview>
    </Root>
  );
};
