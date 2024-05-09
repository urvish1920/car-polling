import { BASE_URL } from "@/app/utils/apiutils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface TotalData {
  totalUsers: number;
  totalRides: number;
  totalRequests: number;
}

interface TotalDataState {
  totalData: TotalData | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: TotalDataState = {
  totalData: null,
  isLoading: false,
  isError: false,
};

export const fetchTotalData = createAsyncThunk(
  "totalData/fetchTotalData",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/totals`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch total data");
      }
      return response.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const totalDataSlice = createSlice({
  name: "totalData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTotalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalData = action.payload;
      })
      .addCase(fetchTotalData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default totalDataSlice.reducer;
