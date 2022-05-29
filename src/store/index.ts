import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import addressReducer from "../features/address/addressSlice";

export const store = configureStore({
  reducer: {
    address: addressReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
