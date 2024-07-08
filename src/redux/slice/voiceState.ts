import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDefaultVoice, voiceCategoryList } from "@/services/voice";
import { message } from "antd";

const initialState: {
  list: any[];
  category: any[];
  voice?: any;
  defaultVoice?: any;
  loading: {
    category?: "loading" | "succeeded" | "failed";
    defaultVoice?: "loading" | "succeeded" | "failed";
  };
  error: {
    category?: string;
    defaultVoice?: string;
  };
} = {
  list: [],
  category: [],
  loading: {
    category: undefined,
    defaultVoice: undefined
  },
  error: {
    category: undefined,
    defaultVoice: undefined
  },
  voice: undefined,
  defaultVoice: undefined
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
        state.loading.category = "loading";
        state.error.category = undefined;
      })
      .addCase(fetchVocieCategory.fulfilled, (state, action) => {
        state.loading.category = "succeeded";
        state.category = action.payload;
        state.error.category = undefined;
      })
      .addCase(fetchVocieCategory.rejected, (state, action) => {
        state.loading.category = "failed";
        state.error.category = action.error.message;
        message.error(action.error.message);
      });

    builder
      .addCase(fetchDefaultVoice.pending, (state) => {
        state.loading.defaultVoice = "loading";
        state.error.defaultVoice = undefined;
      })
      .addCase(fetchDefaultVoice.fulfilled, (state, action) => {
        state.loading.defaultVoice = "succeeded";
        state.defaultVoice = action.payload;
        state.error.defaultVoice = undefined;
      })
      .addCase(fetchDefaultVoice.rejected, (state, action) => {
        state.loading.defaultVoice = "failed";
        state.error.defaultVoice = action.error.message;
        message.error(action.error.message);
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

export const fetchDefaultVoice = createAsyncThunk(
  "voiceState/fetchDefaultVoice",
  async () => {
    const res: any = await getDefaultVoice();
    if (res.code === 1) {
      return res.data;
    }
  }
);

export default voiceStateSlice.reducer;
