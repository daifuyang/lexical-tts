import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { voiceCategoryList } from "@/services/voice";
import { message } from "antd";

const initialState: {
  list: any[];
  category: any[];
  categoryStatus?: "loading" | "succeeded" | "failed";
  categoryError?: string | null;
  voice?: any;
} = {
  list: [],
  category: [],
  categoryStatus: undefined,
  categoryError: null,
  voice: null
};

export const voiceStateSlice = createSlice({
  name: "voiceState",
  initialState,
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setVoice: (state, action) => {
      state.voice = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVocieCategory.pending, (state) => {
        state.categoryStatus = "loading";
        state.categoryError = null;
      })
      .addCase(fetchVocieCategory.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.category = action.payload;
      })
      .addCase(fetchVocieCategory.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.categoryError = action.error.message;
        message.error(action.error.message)
      });
  }
});

export const { setVoice, setList } = voiceStateSlice.actions;

export const fetchVocieCategory = createAsyncThunk(
  "voiceState/fetchVocieCategory",
  async (params: any, thunkAPI) => {
    const res: any = await voiceCategoryList(params);
    if (res.code === 1) {
      return res.data;
    }
  }
);

export default voiceStateSlice.reducer;
