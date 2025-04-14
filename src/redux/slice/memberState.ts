import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsageStats } from '@/services/member';
import type { Response } from '@/lib/request';

import type { UsageStats } from "@/services/member";

interface MemberState {
  usageStats: UsageStats | null;
  loading: boolean;
  error: string | null;
}

interface MemberState {
  usageStats: UsageStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  usageStats: null,
  loading: false,
  error: null
};

export const fetchUsageStats = createAsyncThunk<UsageStats, number, { rejectValue: string }>(
  'member/fetchUsageStats',
  async (workId: number, { rejectWithValue }) => {
    try {
      const res: Response<UsageStats> = await getUsageStats(workId);
      if (res.code === 1) {
        return res.data!;
      }
      return rejectWithValue(res.msg || 'Failed to fetch usage stats');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch usage stats');
    }
  }
);

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsageStats.fulfilled, (state, action: PayloadAction<UsageStats>) => {
        state.loading = false;
        state.usageStats = action.payload;
      })
      .addCase(fetchUsageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch usage stats';
      });
  }
});

export default memberSlice.reducer;
