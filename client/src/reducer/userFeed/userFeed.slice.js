import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserFeed,
  likePost,
  bookmarkPost,
  commentOnPost,
} from "./userFeed.thunk";

const initialState = {
  posts: [],
  totalPosts: 0,
  limit: 0,
  page: 1,
  totalPages: 0,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
  isLoading: false,
  error: null,
};

const userFeedSlice = createSlice({
  name: "userFeed",
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.posts = [];
      state.totalPosts = 0;
      state.limit = 0;
      state.page = 1;
      state.totalPages = 0;
      state.pagingCounter = 0;
      state.hasPrevPage = false;
      state.hasNextPage = false;
      state.prevPage = null;
      state.nextPage = null;
      state.isLoading = false;
      state.error = null;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(
        (post) => post._id === updatedPost._id
      );
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;
        state.posts = [...state.posts, ...data.posts];
        state.totalPosts = data.totalPosts;
        state.limit = data.limit;
        state.page = data.page;
        state.totalPages = data.totalPages;
        state.pagingCounter = data.pagingCounter;
        state.hasPrevPage = data.hasPrevPage;
        state.hasNextPage = data.hasNextPage;
        state.prevPage = data.prevPage;
        state.nextPage = data.nextPage;
      })
      .addCase(fetchUserFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const likedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === likedPost._id
        );
        if (index !== -1) {
          state.posts[index].isLiked = likedPost.isLiked;
          state.posts[index].likes = likedPost.likes;
        }
      })
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        console.log("action.payload: ", action.payload);
        const bookmarkedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === bookmarkedPost._id
        );
        if (index !== -1) {
          state.posts[index].isBookmarked = bookmarkedPost.isBookmarked;
        }
      })
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const commentedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === commentedPost._id
        );
        if (index !== -1) {
          state.posts[index] = commentedPost;
        }
      });
  },
});

export const { resetFeed, updatePost } = userFeedSlice.actions;

export default userFeedSlice.reducer;
