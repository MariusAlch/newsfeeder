import Router from "next/router";
import { FiMessageSquare } from "react-icons/fi";
import { Post } from "../../shared/data.model";
import { styled } from "../util/styled";

const Root = styled.div`
  display: inline-flex;
  height: 30px;
`;

const Container = styled.div`
  height: 100%;
`;

const ReactImage = styled.img`
  height: 100%;
  filter: saturate(1.25);
`;

const Count = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  height: 100%;
  margin-right: 8px;
  margin-left: 4px;
  font-weight: 600;
`;

export const FeedbackSummary: React.FunctionComponent<{ post: Post }> = props => {
  const counters = props.post.feedbacks.reduce(
    (agg, post) => {
      if (post.value === 1) {
        agg.good++;
      } else if (post.value === 0) {
        agg.middle++;
      } else if (post.value === -1) {
        agg.bad++;
      }
      if (!!post.text) {
        agg.comments++;
      }
      return agg;
    },
    {
      good: 0,
      middle: 0,
      bad: 0,
      comments: 0,
    },
  );

  return (
    <Root>
      <Container>
        <ReactImage src="/static/svg/happy.svg" />
        <Count>{counters.good}</Count>
      </Container>
      <Container>
        <ReactImage src="/static/svg/middle.svg" />
        <Count>{counters.middle}</Count>
      </Container>
      <Container>
        <ReactImage src="/static/svg/sad.svg" />
        <Count>{counters.bad}</Count>
      </Container>
      <Container>
        <FiMessageSquare size={30} />
        <Count>{counters.comments}</Count>
      </Container>
    </Root>
  );
};
