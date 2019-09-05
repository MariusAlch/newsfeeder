import axios from "axios";
import { useEffect, useState } from "react";
import { Post, WidgetConfig } from "../../../shared/data.model";
import { getClientConfig } from "../../util/client-config";

export function usePostsLoader(widgetConfig: WidgetConfig) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  function loadMorePosts() {
    if (loading || done) {
      return;
    }
    setPage(page + 1);
  }

  useEffect(() => {
    if (!widgetConfig) {
      return;
    }

    const { companyId } = widgetConfig;
    setLoading(true);
    axios
      .get<Post[]>(`${getClientConfig().API_URL}/api/users/posts`, {
        params: { companyId, page },
      })
      .then(resp => {
        const newPosts = resp.data;
        if (newPosts.length === 0) {
          return setDone(true);
        }
        setPosts(oldPosts => [...oldPosts, ...newPosts]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, widgetConfig]);

  return { loadMorePosts, posts };
}
