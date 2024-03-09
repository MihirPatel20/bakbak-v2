import { createSlice } from "@reduxjs/toolkit";
import config from "@/config";

// Initial state
const initialState = {
  isOpen: [],
  defaultId: "default",
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
};

// Slice
const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    menuOpen(state, action) {
      state.isOpen = [action.payload];
    },
    setMenu(state, action) {
      state.opened = action.payload;
    },
    setFontFamily(state, action) {
      state.fontFamily = action.payload;
    },
    setBorderRadius(state, action) {
      state.borderRadius = action.payload;
    },
  },
});

// Export reducer and actions
export const { menuOpen, setMenu, setFontFamily, setBorderRadius } =
  customizationSlice.actions;
export default customizationSlice.reducer;
