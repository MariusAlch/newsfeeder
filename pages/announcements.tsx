import moment from "moment";
import Link from "next/link";
import { useContext } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { PageTitle, Separator } from "../lib/components/common.components";
import { DashboardPost } from "../lib/components/DashboardPost";
import { Button } from "../lib/components/form/Button";
import { OptionalRender } from "../lib/components/OptionalRender";
import { PageLayout } from "../lib/components/PageLayout";
import { ProtectedPage } from "../lib/components/ProtectedPage";
import { usePostsSearch } from "../lib/components/use-posts-search";
import { AgentContainer } from "../lib/containers/agent.container";
import { styled } from "../lib/util/styled";

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LoadSensor = styled.div`
  margin-top: -50px;
  height: 50px;
  width: 50px;
  position: relative;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export default ProtectedPage(() => {
  const agentContainer = useContext(AgentContainer.Context);

  const { loadMorePosts, posts } = usePostsSearch();

  return (
    <PageLayout>
      <TopContent>
        <PageTitle>Announcements</PageTitle>
        <Link href="/post-editor">
          <Button>Create Post</Button>
        </Link>
      </TopContent>
      <Separator />
      <OptionalRender shouldRender={agentContainer.isLoggedIn}>
        {posts
          .sort((a, b) => moment(b.scheduledDate).valueOf() - moment(a.scheduledDate).valueOf())
          .map((post, i) => (
            <DashboardPost post={post} key={i} />
          ))}
        <Center>
          <VisibilitySensor
            onChange={visible => {
              if (visible) {
                loadMorePosts();
              }
            }}>
            <LoadSensor />
          </VisibilitySensor>
        </Center>
      </OptionalRender>
    </PageLayout>
  );
});
