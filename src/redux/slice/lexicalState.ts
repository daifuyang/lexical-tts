import { getWorkDetail } from "@/services/work";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 创建获取工作空间信息
export const fetchWorkDetail = createAsyncThunk<any, number>("data/fetchWorkDetail", async (id, thunkAPI) => {
  const res: any = await getWorkDetail(id);
  if (res.code !== 1) {
    return thunkAPI.rejectWithValue(res);
  }
  return res.data;
});

const initialState: {
  playingNodeKey?: any;
  work?: {
    id: number;
    name: string;
  } | null; // 项目数据
  loading: {
    work: boolean,
  };
  error: {
    work: any
  };
} = {
  playingNodeKey: null,
  work: null,
  loading: { work: false },
  error: {
    work: null
  }
};

export const lexicalStateSlice = createSlice({
  name: "lexicalState",
  initialState,
  reducers: {
    setPlayingNodeKey: (state, action) => {
      state.playingNodeKey = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkDetail.pending, (state) => {
        state.loading.work = true;
      })
      .addCase(fetchWorkDetail.fulfilled, (state, action) => {
        state.loading.work = false;
        state.work = action.payload
      })
      .addCase(fetchWorkDetail.rejected, (state, action) => {
        state.error.work = action.payload;
      });
  }
});

export const { setPlayingNodeKey } = lexicalStateSlice.actions;

export default lexicalStateSlice.reducer;
