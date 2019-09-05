import moment from "moment";
import { useContext, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { FiX } from "react-icons/fi";
import VisibilitySensor from "react-visibility-sensor";
import { WidgetContainer } from "../../containers/widget.container";
import { styled, theme } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";
import { Card } from "./Card";

const Root = styled.div`
  background-color: ${p => p.theme.colors.lightGray};
`;

const Header = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  padding-right: 8px;
  font-size: 16px;
  font-weight: 600;
`;

const CloseIcon = styled(FiX)`
  cursor: pointer;
`;

const Separator = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-left: 12px;
  margin-right: 12px;
`;

const Branding = styled.div`
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const Link = styled.a`
  margin-left: 4px;
  font-weight: 700;
  text-decoration: none;
  color: inherit;
`;

const LoadSensor = styled.div`
  margin-top: -100px;
  height: 50px;
  margin-bottom: 50px;
  z-index: -1;
  position: relative;
`;

export const WidgetContent: React.FunctionComponent<{}> = () => {
  const widgetContainer = useContext(WidgetContainer.Context);

  const { height } = widgetContainer.windowSize;

  const separatorHeight = 1;
  const brandingHeight = widgetContainer.widgetInfo.company.planType === "start" ? 34 + separatorHeight : 0;
  const headerHeight = 50 + separatorHeight;

  const contentHeight = height - (headerHeight + brandingHeight);

  return (
    <Root>
      <Header>
        <div>Announcements</div> <CloseIcon onClick={() => widgetContainer.setMenuOpen(false)} size={30} />
      </Header>
      <Separator />
      <Scrollbars
        renderTrackVertical={props => <div {...props} />}
        renderTrackHorizontal={props => <div {...props} />}
        style={{ height: contentHeight }}>
        {widgetContainer.posts
          .sort((a, b) => moment(b.scheduledDate).valueOf() - moment(a.scheduledDate).valueOf())
          .map((post, i) => (
            <Card key={i} post={post} />
          ))}

        <VisibilitySensor
          onChange={visible => {
            if (visible && widgetContainer.menuOpen) {
              widgetContainer.postsLoader.loadMorePosts();
            }
          }}>
          <LoadSensor />
        </VisibilitySensor>
      </Scrollbars>
      <OptionalRender shouldRender={brandingHeight !== 0}>
        <Separator />
        <Branding>
          Created with
          <Link target="_blank" href="https://www.newsfeeder.io">
            NewsFeeder
          </Link>
        </Branding>
      </OptionalRender>
    </Root>
  );
};
