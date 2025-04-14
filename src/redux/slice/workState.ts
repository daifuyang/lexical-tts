import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $getRoot, LexicalEditor } from 'lexical';
import { createWork as apiCreateWork } from '@/services/work';
import { message } from 'antd';

interface CreateWorkOptions {
  editor: LexicalEditor;
  voiceName: string;
  status?: number;
  defaultTitle?: string;
}

interface WorkState {
  loading: boolean;
  error: string | null;
  currentWork: any | null;
}

const initialState: WorkState = {
  loading: false,
  error: null,
  currentWork: null
};

export const createWork = createAsyncThunk(
  'work/create',
  async ({ editor, voiceName, status = 0, defaultTitle = '未命名作品' }: CreateWorkOptions, { rejectWithValue }) => {
    if (!voiceName) {
      message.error('请先选择主播声音');
      return rejectWithValue('Voice name is required');
    }

    try {
      const editorState = editor.getEditorState();
      const content = editorState.read(() => {
        const root = $getRoot();
        return root.getTextContent();
      });

      let title = defaultTitle;
      if (content) {
        const firstSentence = content.split(/[。！？]/)[0]?.trim();
        if (firstSentence) {
          title = firstSentence.substring(0, 30);
        }
      }

      const res = await apiCreateWork({
        title,
        voiceName,
        editorState: JSON.stringify(editorState.toJSON()),
        status
      });

      if (res.code === 1) {
        const data = res.data;
        return data;
      }

      message.error(res.msg);

    } catch (error) {
      message.error('作品创建失败');
      return rejectWithValue(error);
    }
  }
);

const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWork.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWork = action.payload;
      })
      .addCase(createWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default workSlice.reducer;
