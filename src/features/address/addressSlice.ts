import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppThunk } from "../../store";
import {
  getAddreses,
  createAddress,
  getTransactionsByAddress,
} from "./addressAPI";
import { AddressProps } from "../../components/Dashboard/AddressEditor";

type Status = "idle" | "loading" | "failed";

export interface AddressState {
  userAddresses: AddressProps[];
  address: AddressProps;
  userAddressesStatus: Status;
  addAddressStatus: Status;
  getTransactionsByAddressStatus: Status;
}

const initialState: AddressState = {
  userAddresses: [],
  userAddressesStatus: "idle",
  addAddressStatus: "idle",
  getTransactionsByAddressStatus: "idle",
  address: {
    _id: "",
    address: "",
    title: "",
    fave: false,
    usd: "",
    eur: "",
  },
};

export const getAddressesAsync = createAsyncThunk(
  "address/getAddresses",
  async () => {
    const { data } = await getAddreses();
    return data;
  }
);

export const createAddressAsync = createAsyncThunk(
  "address/createAddress",
  async (formData: AddressProps) => {
    await createAddress(formData);
  }
);

export const getTransactionsByAddressAsync = createAsyncThunk(
  "address/getTransactionsByAddress",
  async (address: string) => {
    const { data } = await getTransactionsByAddress(address);
    if (data.message === "NOTOK") {
      throw new Error("Invalid address!");
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    resetStatuses: (state) => {
      state.userAddressesStatus = "idle";
      state.addAddressStatus = "idle";
      state.getTransactionsByAddressStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddressesAsync.pending, (state) => {
        state.userAddressesStatus = "loading";
      })
      .addCase(getAddressesAsync.fulfilled, (state, action) => {
        state.userAddressesStatus = "idle";
        state.userAddresses = action.payload;
      })
      .addCase(getAddressesAsync.rejected, (state) => {
        state.userAddressesStatus = "failed";
      })
      .addCase(createAddressAsync.pending, (state) => {
        state.addAddressStatus = "loading";
      })
      .addCase(createAddressAsync.fulfilled, (state) => {
        state.addAddressStatus = "idle";
      })
      .addCase(createAddressAsync.rejected, (state) => {
        state.addAddressStatus = "failed";
      })
      .addCase(getTransactionsByAddressAsync.fulfilled, (state) => {
        state.getTransactionsByAddressStatus = "idle";
      })
      .addCase(getTransactionsByAddressAsync.rejected, (state) => {
        state.getTransactionsByAddressStatus = "failed";
      });
  },
});

export const { resetStatuses } = addressSlice.actions;

export const selectUserAddresses = (state: RootState) =>
  state.address.userAddresses;

export const selectStatus = (state: RootState) =>
  state.address.userAddressesStatus;
export const selectAddAddressStatus = (state: RootState) =>
  state.address.addAddressStatus;
export const selectGetTransactionsByAddressStatus = (state: RootState) =>
  state.address.getTransactionsByAddressStatus;

export const addUserAddress =
  (formData: AddressProps): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(getTransactionsByAddressAsync(formData.address));
    let status = selectGetTransactionsByAddressStatus(getState());
    if (status === "idle") {
      await dispatch(createAddressAsync(formData));
      status = selectAddAddressStatus(getState());
      if (status === "idle") {
        await dispatch(getAddressesAsync());
      }
    }
  };

export default addressSlice.reducer;
