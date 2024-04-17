import { createSlice } from "@reduxjs/toolkit";

const stepSlice = createSlice({
  name: "step",
  initialState: 1,
  reducers: {
    setStep(state, action) {
      return action.payload;
    },
  },
});

export const { setStep } = stepSlice.actions;
export default stepSlice.reducer;
