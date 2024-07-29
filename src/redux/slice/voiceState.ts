import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDefaultVoice, getVoiceCategoryList, getVoiceDetail } from "@/services/voice";
import { message } from "antd";

const initialState: {
  defaultVoice?: any; // 首次访问默认配音主播
  globalVoice?: any; // 全局默认配音主播
  activeVoice?: any; // 当前配音主播
  loading: {
    defaultVoice?: "loading" | "succeeded" | "failed";
    activeVoice?: "loading" | "succeeded" | "failed";
  };
  error: {
    defaultVoice?: string;
    activeVoice?: string;
  };
  isSaved: Boolean,
} = {
  loading: {
    defaultVoice: undefined
  },
  error: {
    defaultVoice: undefined
  },
  globalVoice: undefined,
  defaultVoice: undefined,
  activeVoice: undefined,
  isSaved: false,
};

export const voiceStateSlice = createSlice({
  name: "voiceState",
  initialState,
  reducers: {
    setGlobalVoice: (state, action) => {
      state.globalVoice = action.payload;
    },
    setActiveVoice: (state, action) => {
      state.activeVoice = action.payload;
    },
    setIsSaved: (state, action) => {
      state.isSaved = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultVoice.pending, (state) => {
        state.loading.defaultVoice = "loading";
        if (!state.activeVoice) {
          state.loading.activeVoice = "loading";
        }
        state.error.defaultVoice = undefined;
      })
      .addCase(fetchDefaultVoice.fulfilled, (state, action) => {
        state.loading.defaultVoice = "succeeded";
        state.globalVoice = action.payload;
        state.defaultVoice = action.payload;
        if (!state.activeVoice) {
          state.activeVoice = action.payload;
          state.loading.activeVoice = "succeeded";
        }
        state.error.defaultVoice = undefined;
      })
      .addCase(fetchDefaultVoice.rejected, (state, action) => {
        state.loading.defaultVoice = "failed";
        state.error.defaultVoice = action.error.message;
        if (!state.activeVoice) {
          state.activeVoice = action.payload;
          state.loading.activeVoice = "failed";
        }
        message.error(action.error.message);
      });

    builder
      .addCase(fetchActiveVoice.pending, (state) => {
        state.loading.activeVoice = "loading";
        state.error.activeVoice = undefined;
      })
      .addCase(fetchActiveVoice.fulfilled, (state, action) => {
        state.loading.activeVoice = "succeeded";
        state.activeVoice = action.payload;
        state.error.activeVoice = undefined;
      })
      .addCase(fetchActiveVoice.rejected, (state, action) => {
        state.loading.activeVoice = "failed";
        state.error.activeVoice = action.error.message;
        message.error(action.error.message);
      });
  }
});

export const { setGlobalVoice, setIsSaved } = voiceStateSlice.actions;

export const fetchDefaultVoice = createAsyncThunk("voiceState/fetchDefaultVoice", async () => {
  const res: any = await getDefaultVoice();
  if (res.code === 1) {
    return res.data;
  }
});

export const fetchActiveVoice = createAsyncThunk(
  "voiceState/fetchActiveVoice",
  async (id: string, thunkAPI) => {
    const res: any = await getVoiceDetail(id);
    if (res.code === 1) {
      return res.data;
    }
  }
);

export default voiceStateSlice.reducer;
