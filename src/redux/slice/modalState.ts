import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  showMembershipModal: boolean;
}

const initialState: ModalState = {
  showMembershipModal: false,
};

export const modalStateSlice = createSlice({
  name: "modalState",
  initialState,
  reducers: {
    openMembershipModal: (state) => {
      state.showMembershipModal = true;
    },
    closeMembershipModal: (state) => {
      state.showMembershipModal = false;
    },
  },
});

export const { openMembershipModal, closeMembershipModal } = modalStateSlice.actions;
export default modalStateSlice.reducer;
