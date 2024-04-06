import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchState {
  from: string;
  to: string;
  date: Date;
  passenger: string;
}

const initialState: SearchState = {
  from: "",
  to: "",
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
