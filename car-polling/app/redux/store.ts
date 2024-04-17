"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import findRideReducer from "@/app/redux/slice/findRideDetailsReducer";
import searchReducer from "@/app/redux/slice/storeSearchData";
import planRideReducer from "@/app/redux/slice/planRideDetailsReducer";
import RequestUserReducer from "@/app/redux/slice/approvalUserReducer";
import stepReducer from "./slice/stepReducer";
import publishReducer from "./slice/publishReducer";

const rootReducer = combineReducers({
  findRide: findRideReducer,
  search: searchReducer,
  PlanRide: planRideReducer,
  RequestUser: RequestUserReducer,
  step: stepReducer,
  publish: publishReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
