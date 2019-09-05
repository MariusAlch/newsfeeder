import axios from "axios";
import { NextPageContext } from "next";
import Router from "next/router";
import React from "react";
import {
  BackButton,
  PageTitle,
  Separator,
  TopContent,
  TopLeftContent,
  VerticalSeparator,
} from "../lib/components/common.components";
import { DashboardPost } from "../lib/components/DashboardPost";
import { FeedbackEntry } from "../lib/components/FeedbackEntry";
import { OptionalRender } from "../lib/components/OptionalRender";
import { PageLayout } from "../lib/components/PageLayout";
import { ProtectedPage } from "../lib/components/ProtectedPage";
import { getClientConfig } from "../lib/util/client-config";
import { styled } from "../lib/util/styled";
import { Post } from "../shared/data.model";

const Root = styled.div``;

interface Props {
  post: Post;
}

const page = ProtectedPage((props: Props) => {
  const feedbacksWithComments = props.post.feedbacks.filter(p => !!p.text);

  return (
    <PageLayout>
      <Root>
        <TopContent>
          <TopLeftContent>
            <BackButton style={{ minWidth: 0 }} onClick={() => Router.back()} secondary>
              Back
            </BackButton>
            <VerticalSeparator />
            <PageTitle>Post Feedback</PageTitle>
          </TopLeftContent>
          <div />
        </TopContent>
        <Separator style={{ marginBottom: 20 }} />
        <DashboardPost post={props.post} />
        <TopContent>
          <PageTitle>Comments</PageTitle>
        </TopContent>
        <Separator style={{ marginBottom: 20 }} />
        <OptionalRender shouldRender={feedbacksWithComments.length === 0}>
          <div style={{ fontWeight: 600 }}>No comments yet...</div>
        </OptionalRender>
        {feedbacksWithComments.map((feedback, i) => (
          <FeedbackEntry feedback={feedback} key={i} />
        ))}
      </Root>
    </PageLayout>
  );
});

(page as any).getInitialProps = async (context: NextPageContext) => {
  const postId = context.query.postId;
  if (!postId) {
    return { post: null };
  }

  const resp = await axios.get(`${getClientConfig().API_URL}/api/posts/post`, {
    params: { postId: context.query.postId },
  });

  return { post: resp.data };
};

export default page;
