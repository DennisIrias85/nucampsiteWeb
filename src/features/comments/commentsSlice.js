import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../app/shared/baseUrl";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    try {
      const response = await fetch(baseUrl + "comments");
      if (!response.ok) {
        return Promise.reject(
          "Unable to fetch comments, status: " + response.status
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return Promise.reject("Failed to fetch comments: " + error.message);
    }
  }
);

export const postComment = createAsyncThunk(
  "comments/postComment",
  async (comment, { dispatch }) => {
    try {
      const response = await fetch(baseUrl + "comments", {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return Promise.reject(
          "Unable to post comment, status: " + response.status
        );
      }

      const data = await response.json();
      dispatch(addComment(data));
    } catch (error) {
      return Promise.reject("Failed to post comment: " + error.message);
    }
  }
);

const initialState = {
  commentsArray: [],
  isLoading: true,
  errMsg: "",
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.commentsArray.push(action.payload);
    },
  },
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.commentsArray = action.payload;
    },
    [fetchComments.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error
        ? action.error.message
        : "Fetch comments failed";
    },
    [postComment.rejected]: (state, action) => {
      alert(
        "Your comment could not be posted\nError: " +
          (action.error ? action.error.message : "Fetch Failed")
      );
    },
  },
});

export const { addComment } = commentsSlice.actions;

export const selectCommentsByCampsiteId = (campsiteId) => (state) => {
  return state.comments.commentsArray.filter(
    (comment) => comment.campsiteId === parseInt(campsiteId)
  );
};

export const commentsReducer = commentsSlice.reducer;
