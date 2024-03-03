import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  isPinyinEdit: Boolean;
}

const initialState: InitialState = {
  isPinyinEdit: false
};

export const initialStateSlice = createSlice({
  name: "initialState",
  initialState,
  reducers: {
    setIsPinyinEdit: (state, action: PayloadAction<boolean>) => {
      state.isPinyinEdit = action.payload;
    }
  }
});

export const { setIsPinyinEdit } = initialStateSlice.actions;

export default initialStateSlice.reducer;
