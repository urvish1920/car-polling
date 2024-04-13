// redux/slice/findRideDetailsReducer.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Ride {
  _id: string;
  vehicle_id: string;
  pick_up: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  drop_off: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  planride_date: Date;
  start_time: string;
  end_time: string;
  price: number;
  user: {
    user_name: string;
  };
  vehicle: {
    name: string;
    No_Plate: string;
    model: string;
    seaters: Number;
  };
}

interface FindRideState {
  rides: Ride[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: FindRideState = {
  rides: [],
  isLoading: false,
  isError: false,
};

export const fetchFindRides = createAsyncThunk(
  "findRide/fetchFindRides",
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/rides/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ride details");
      }
      return response.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const findRideSlice = createSlice({
  name: "findRide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFindRides.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchFindRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rides = action.payload;
      })
      .addCase(fetchFindRides.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default findRideSlice.reducer;
