import { SerializedLexicalNode } from "lexical";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    playingNodeKey?: any;
} = {
    playingNodeKey: null
};

export const lexicalStateSlice = createSlice({
  name: "lexicalState",
  initialState,
  reducers: {
    setPlayingNodeKey: (state, action) => {
      state.playingNodeKey = action.payload;
    }
  }
});

export const { setPlayingNodeKey } = lexicalStateSlice.actions;

export default lexicalStateSlice.reducer;
