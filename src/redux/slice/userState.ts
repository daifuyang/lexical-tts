import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const initialStateSlice = createSlice({
  name: "initialState",
  initialState,
  reducers: {
    setUser: (
        state,action
    ) => {
        state.user = action.payload;
    }
  }
});

export const { setUser } = initialStateSlice.actions;

export default initialStateSlice.reducer;
