import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../../shared/data.model";

export function usePostsSearch() {
  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  function loadMorePosts() {
    if (done || loading) {
      return;
    }
    setPage(page + 1);
  }

  useEffect(() => {
    if (page === -1) {
      return;
    }

    setLoading(true);
    axios
      .get<Post[]>(`/api/posts/search`, { params: { page } })
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
  }, [page]);

  return { loadMorePosts, posts };
}
