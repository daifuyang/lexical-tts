import { configureStore } from "@reduxjs/toolkit";
import initialState from "./slice/initialState";
import userState from "./slice/userState";
import voiceState from "./slice/voiceState";
import lexicalState from "./slice/lexicalState";

export const store = configureStore({
  reducer: {
    initialState,
    userState,
    voiceState,
    lexicalState
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
