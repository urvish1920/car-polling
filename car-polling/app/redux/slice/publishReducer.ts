import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pick_up: {
    city: "",
    fullAddress: "",
    lat: 0,
    lng: 0,
  },
  drop_off: {
    city: "",
    fullAddress: "",
    lat: 0,
    lng: 0,
  },
  planride_date: "",
  start_time: "",
  end_time: "",
  price: 0,
  vehicle_id: "",
};

const publishSlice = createSlice({
  name: "publish",
  initialState,
  reducers: {
    setPublish(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setPublish } = publishSlice.actions;
export default publishSlice.reducer;
