import moment from "moment";
import { Feedback } from "../../shared/data.model";
import { styled } from "../util/styled";

const Root = styled.div`
  & + & {
    margin-top: 16px;
  }
  display: flex;
`;

const Author = styled.div`
  font-weight: 600;
  display: inline-block;
`;

const Date = styled.div`
  display: inline-block;
  margin-left: 8px;
  color: ${p => p.theme.colors.darkGray};
`;

const Text = styled.div`
  margin-top: 4px;
  margin-bottom: 8px;
`;
const Content = styled.div`
  flex-grow: 1;
`;

const ReactImage = styled.img<{ unselected?: boolean }>`
  height: 35px;
  width: 35px;
  filter: saturate(1.25);
  margin-top: 4px;
  margin-right: 8px;

  ${p =>
    p.unselected &&
    `
    filter: grayscale(1);
  `}
`;

export const FeedbackEntry: React.FunctionComponent<{ feedback: Feedback }> = props => {
  function getImage() {
    switch (props.feedback.value) {
      case 1:
        return <ReactImage src="/static/svg/happy.svg" />;
      case 0:
        return <ReactImage src="/static/svg/middle.svg" />;
      case -1:
        return <ReactImage src="/static/svg/sad.svg" />;
      default:
        return <ReactImage unselected src="/static/svg/middle.svg" />;
    }
  }

  return (
    <Root>
      {getImage()}
      <Content>
        <Author>{props.feedback.user.name}</Author>
        <Date>{moment(props.feedback.updatedAt).format("MMMM Do YYYY, h:mm a")}</Date>
        <Text>{props.feedback.text}</Text>
      </Content>
    </Root>
  );
};
