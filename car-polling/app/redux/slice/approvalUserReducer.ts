// redux/slice/findRideDetailsReducer.ts
import { BASE_URL } from "@/app/utils/apiutils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface RequestData {
  _id: string;
  Ride_Id: string;
  createdAt: string;
  updatedAt: string;
  from: string;
  to: string;
  my_status: string;
  payment: string;
  passenger: number;
  status_Request: string;
  user_id: string;
  user: {
    _id: string;
    user_name: string;
    image: String;
  };
}

interface FindRideState {
  request: RequestData[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: FindRideState = {
  request: [],
  isLoading: false,
  isError: false,
};

export const fetchRequestUser = createAsyncThunk(
  "findRide/fetchFindRides",
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/request/notifationUser/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch request details");
      }
      return response.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const RequestRideSlice = createSlice({
  name: "requestUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchRequestUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.request = action.payload;
      })
      .addCase(fetchRequestUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default RequestRideSlice.reducer;
