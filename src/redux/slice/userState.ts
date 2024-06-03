import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const userStateSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setUser: (
        state,action
    ) => {
        state.user = action.payload;
    }
  }
});

export const { setUser } = userStateSlice.actions;

export default userStateSlice.reducer;
