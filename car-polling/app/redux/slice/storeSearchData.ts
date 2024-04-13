import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchState {
  from: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  to: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  date: Date;
  passenger: string;
}

const initialState: SearchState = {
  from: {
    city: "",
    fullAddress: "",
    lat: 0,
    lng: 0,
  },
  to: {
    city: "",
    fullAddress: "",
    lat: 0,
    lng: 0,
  },
  date: new Date(),
  passenger: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<SearchState>) => {
      return action.payload;
    },
  },
});

export const { setSearchData } = searchSlice.actions;

export const selectSearchData = (state: RootState) => state.search;

export default searchSlice.reducer;
