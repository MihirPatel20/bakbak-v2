import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  useMediaQuery,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useTheme } from "@mui/system";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";
import { usePostDialog } from "context/PostDialogContext";
import generateExploreGrid from "utils/helpers/generateExploreGrid";

const ExplorePosts = () => {
  const { openDialog } = usePostDialog();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [gridConfig, setGridConfig] = useState([]);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching]
  );

  const getLimit = useCallback(() => {
    return matchDownSM ? 6 : 9;
  }, [matchDownSM]);

  const limit = getLimit();

  const fetchPosts = useCallback(
    async (pageNumber) => {
      setIsFetching(true);
      try {
        const response = await api.get(
          `/explore?page=${pageNumber}&limit=${limit}`
        );
        const fetchedPosts = response.data.data.posts.filter(
          (post) => post.images && post.images.length > 0
        );

        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setHasMore(response.data.data.hasNextPage);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [limit]
  );

  // Adjusting cols based on screen size
  const cols = matchDownSM ? 3 : 6;

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  useEffect(() => {
    if (posts.length > 0) {
      const { items } = generateExploreGrid(posts.length, cols);
      setGridConfig(items);
    }
  }, [posts, matchDownSM]);

  if (posts.length === 0) {
    return (
      <ImageList cols={cols} gap={8}>
        <ImagePlaceholder height={200} />
      </ImageList>
    );
  }

  return (
    <Box>
      <ImageList variant="" cols={cols} gap={4} rowHeight={matchDownSM ? 100 :200}>
        {posts.map((post, index) => (
          <ImageCard
            key={post._id}
            post={post}
            index={index}
            totalPosts={posts.length}
            lastPostElementRef={lastPostElementRef}
            openDialog={openDialog}
            gridConfig={gridConfig}
          />
        ))}
      </ImageList>
      {isFetching && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ExplorePosts;

const ImageCard = ({
  post,
  index,
  lastPostElementRef,
  openDialog,
  totalPosts,
  gridConfig,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchImageUrl = async (url) => {
    const defaultImage =
      "http://localhost:8080/images/image172327007458649446.jpg"; // replace with your default image URL

    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return url;
      } else {
        return defaultImage;
      }
    } catch (error) {
      console.error("Image fetch error:", error);
      return defaultImage;
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      const resolvedUrl = await fetchImageUrl(
        getUserAvatarUrl(post?.images[0])
      );
      setImageUrl(resolvedUrl);
      setLoading(false);
    };

    loadImage();
  }, [post.images, post._id]);

  return (
    <ImageListItem
      ref={index === totalPosts - 1 ? lastPostElementRef : null}
      cols={gridConfig[index]?.colSpan || 1}
      rows={gridConfig[index]?.rowSpan || 1}
      sx={{ borderRadius: "3px", overflow: "hidden" }}
    >
      {loading || !post?.images[0] ? (
        <ImagePlaceholder height={200} />
      ) : (
        <CardMedia
          component="img"
          image={imageUrl}
          alt={`Image for post ${post._id}`}
          onClick={() => openDialog(post._id)}
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      )}

      {/* <ImageListItemBar title={index} /> */}
    </ImageListItem>
  );
};
