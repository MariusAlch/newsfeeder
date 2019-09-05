import axios from "axios";
import createContainer from "constate";
import { useEffect, useState } from "react";
import { Post, WidgetConfig, WidgetInfo } from "../../shared/data.model";
import { usePostsLoader } from "../components/widget/use-posts-loader";
import { getClientConfig } from "../util/client-config";

export const WidgetContainer = createContainer(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<null | string>(null);
  const [widgetInfo, setWidgetInfo] = useState<WidgetInfo>(null);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const postsLoader = usePostsLoader(widgetConfig);

  useEffect(() => {
    if (!widgetConfig) {
      return;
    }

    window.NewsFeeder.hide = () => setMenuOpen(false);
    window.NewsFeeder.show = () => setMenuOpen(true);

    const { companyId, name } = widgetConfig;
    axios
      .get<WidgetInfo>(`${getClientConfig().API_URL}/api/users/widget-info`, {
        params: { companyId, name },
      })
      .then(resp => {
        setWidgetInfo(resp.data);
        setMenuOpen(widgetConfig.preview);
      });
  }, [widgetConfig]);

  return {
    widgetInfo,
    setWidgetInfo,
    menuOpen,
    setMenuOpen,
    windowSize,
    setWindowSize,
    previewImage,
    setPreviewImage,
    widgetConfig,
    setWidgetConfig,
    posts: postsLoader.posts,
    postsLoader,

    get isMobile() {
      return !(windowSize.width > 500);
    },
  };
});
