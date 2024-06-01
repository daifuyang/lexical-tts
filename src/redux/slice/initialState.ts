import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type FloatEditType = "pinyin" | "symbol" | "speed" | "alias" | undefined;

export type FloatDomRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface InitialState {
  floatEditType: FloatEditType;
  floatDomRect: FloatDomRect | undefined;
  selectionText: string | undefined;
  floatEditValue: string | undefined; // 当前类型操作的值
  nodeKey: string | undefined;
}

const initialState: InitialState = {
  floatEditType: undefined,
  floatDomRect: undefined,
  selectionText: undefined,
  floatEditValue: undefined,
  nodeKey: undefined,
};

export const initialStateSlice = createSlice({
  name: "initialState",
  initialState,
  reducers: {
    setFloatType: (state, action: PayloadAction<FloatEditType>) => {
      state.floatEditType = action.payload;
    },
    setFloatEditValue: (state, action: PayloadAction<string>) => {
      state.floatEditValue = action.payload;
      state.floatEditType = undefined // 设置完成值则关闭窗口
    },
    setNodeKey: (state, action: PayloadAction<string>) => {
      state.nodeKey = action.payload;
    },
    setSelectionText: (state, action: PayloadAction<string>) => {
      state.selectionText = action.payload;
    },
    setFloatDomRect: (state, action: PayloadAction<FloatDomRect | undefined>) => {
      state.floatDomRect = action.payload;
    },
    closeFloat: (state) => {
      state.floatEditType = undefined;
      state.selectionText = undefined;
      state.floatEditValue = undefined;
    },
    setInitialState: (
      state,
      action: PayloadAction<{
        type?: FloatEditType;
        selectionText?: string | undefined;
        domRect?: FloatDomRect | undefined;
        value?: string | undefined;
        nodeKey?: string | undefined;
      }>
    ) => {
      state.floatEditType = action.payload.type;
      state.selectionText = action.payload.selectionText;
      state.floatDomRect = action.payload.domRect;
      state.floatEditValue = action.payload.value;
      state.nodeKey = action.payload.nodeKey;
    }
  }
});

export const { setFloatType, setFloatEditValue, setSelectionText, setInitialState, closeFloat } =
  initialStateSlice.actions;

export default initialStateSlice.reducer;
