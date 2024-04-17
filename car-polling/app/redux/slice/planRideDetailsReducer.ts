import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StyledString } from "next/dist/build/swc";

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
  leftSites: number;
  user: {
    user_name: string;
    image:String
  };
  vehicle: {
    name: string;
    No_Plate: string;
    model: string;
    seaters: Number;
  };
}

interface PlanRideState {
  rides: Ride[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: PlanRideState = {
  rides: [],
  isLoading: false,
  isError: false,
};

export const fetchPlanRides = createAsyncThunk(
  "planRide",
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/rides/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch ride details");
      }
      return response.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const planRideSlice = createSlice({
  name: "PlanRide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanRides.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPlanRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rides = action.payload;
      })
      .addCase(fetchPlanRides.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default planRideSlice.reducer;
