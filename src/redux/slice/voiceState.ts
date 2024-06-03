import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVoiceLst } from "@/model/ttsVoice";
import { voiceCategoryList } from "@/services/voice";

const initialState: {
  list: any[];
  category: any[];
  categoryLoading: boolean;
  categoryError?: string | null;
  voice?: any;
} = {
  list: [],
  category: [],
  categoryLoading: false,
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
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchVocieCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.category = action.payload;
      })
      .addCase(fetchVocieCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.error.message;
      });
  }
});

export const { setVoice, setList } = voiceStateSlice.actions;

export const fetchVocieCategory = createAsyncThunk(
  "voiceState/fetchVocieCategory",
  async (params, thunkAPI) => {
    const res: any = await voiceCategoryList(params);
    if (res.code === 1) {
      return res.data;
    }
  }
);

export default voiceStateSlice.reducer;
