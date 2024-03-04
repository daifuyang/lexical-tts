import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type FloatEditType = "pinyin" | "symbol" | undefined;

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
  selectionText: string | undefined;
  floatDomRect: FloatDomRect | undefined;
  floatEditValue: string | undefined; // 当前类型操作的值
}

const initialState: InitialState = {
  floatEditType: undefined,
  selectionText: undefined,
  floatDomRect: undefined,
  floatEditValue: undefined
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
      }>
    ) => {
      state.floatEditType = action.payload.type;
      state.selectionText = action.payload.selectionText;
      state.floatDomRect = action.payload.domRect;
      state.floatEditValue = action.payload.value;
    }
  }
});

export const { setFloatType, setFloatEditValue, setSelectionText, setInitialState, closeFloat } =
  initialStateSlice.actions;

export default initialStateSlice.reducer;
