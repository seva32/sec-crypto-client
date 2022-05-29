import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState, AppThunk } from "../../store";
import {
  getAddreses,
  createAddress,
  getTransactionsByAddress,
  getAddress,
  getBalanceMulti,
  updateAddress,
  deleteAddress,
} from "./addressAPI";
import { AddressProps } from "../../components/Dashboard/AddressEditor";
import { isOldWallet, weiToEth } from "../../utils/helpers";

type Status = "idle" | "loading" | "failed";

export interface AddressState {
  userAddresses: AddressProps[];
  address: AddressProps & { isOld: boolean; currentBalance: number | null };
  userAddressesStatus: Status;
  addAddressStatus: Status;
  getTransactionsByAddressStatus: Status;
  getAddressStatus: Status;
  getBalanceMultiStatus: Status;
  updateAddressStatus: Status;
  deleteAddressStatus: Status;
  transactions?: any;
  balance?: any;
}

const initialState: AddressState = {
  userAddresses: [],
  userAddressesStatus: "idle",
  addAddressStatus: "idle",
  getTransactionsByAddressStatus: "idle",
  getAddressStatus: "idle",
  getBalanceMultiStatus: "idle",
  updateAddressStatus: "idle",
  deleteAddressStatus: "idle",
  address: {
    _id: "",
    address: "",
    title: "",
    fave: false,
    usd: "",
    eur: "",
    isOld: false,
    currentBalance: null,
  },
  transactions: [],
  balance: [],
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

export const updateAddressAsync = createAsyncThunk(
  "address/updateAddress",
  async (formData: AddressProps) => {
    const { data } = await updateAddress(formData);
    return data;
  }
);

export const deleteAddressAsync = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: string) => {
    await deleteAddress(addressId);
  }
);

export const getTransactionsByAddressAsync = createAsyncThunk(
  "address/getTransactionsByAddress",
  async (address: string) => {
    const { data } = await getTransactionsByAddress(address);
    if (data.message === "NOTOK") {
      throw new Error("Invalid address!");
    }
    return data;
  }
);

export const getBalanceMultiAsync = createAsyncThunk(
  "address/getBalanceMulti",
  async (addresses: string[]) => {
    const { data } = await getBalanceMulti(addresses);
    if (data.message === "NOTOK") {
      throw new Error("Invalid address!");
    }
    return data;
  }
);

export const getAddressAsync = createAsyncThunk(
  "address/getAddress",
  async (addressId: string) => {
    const { data } = await getAddress(addressId);
    return data;
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
    setAddressIsOld: (state, action) => {
      state.address.isOld = action.payload;
    },
    setCurrentBalance: (state, action) => {
      state.address.currentBalance = action.payload;
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
      .addCase(updateAddressAsync.pending, (state) => {
        state.updateAddressStatus = "loading";
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        state.updateAddressStatus = "idle";
        state.address.address = action.payload;
      })
      .addCase(updateAddressAsync.rejected, (state) => {
        state.updateAddressStatus = "failed";
      })
      .addCase(deleteAddressAsync.pending, (state) => {
        state.deleteAddressStatus = "loading";
      })
      .addCase(deleteAddressAsync.fulfilled, (state) => {
        state.deleteAddressStatus = "idle";
      })
      .addCase(deleteAddressAsync.rejected, (state) => {
        state.deleteAddressStatus = "failed";
      })
      .addCase(getAddressAsync.pending, (state) => {
        state.getAddressStatus = "loading";
      })
      .addCase(getAddressAsync.fulfilled, (state, action) => {
        state.getAddressStatus = "idle";
        state.address = action.payload;
      })
      .addCase(getAddressAsync.rejected, (state) => {
        state.getAddressStatus = "failed";
      })
      .addCase(getBalanceMultiAsync.pending, (state) => {
        state.getBalanceMultiStatus = "loading";
      })
      .addCase(getBalanceMultiAsync.fulfilled, (state, action) => {
        state.getBalanceMultiStatus = "idle";
        state.balance = action.payload;
      })
      .addCase(getBalanceMultiAsync.rejected, (state) => {
        state.getBalanceMultiStatus = "failed";
      })
      .addCase(getTransactionsByAddressAsync.pending, (state) => {
        state.getTransactionsByAddressStatus = "loading";
      })
      .addCase(getTransactionsByAddressAsync.fulfilled, (state, action) => {
        state.getTransactionsByAddressStatus = "idle";
        state.transactions = action.payload;
      })
      .addCase(getTransactionsByAddressAsync.rejected, (state) => {
        state.getTransactionsByAddressStatus = "failed";
      });
  },
});

export const { resetStatuses, setAddressIsOld, setCurrentBalance } =
  addressSlice.actions;

export const selectUserAddresses = (state: RootState) =>
  state.address.userAddresses;
export const selectAddress = (state: RootState) => state.address.address;

export const selectStatus = (state: RootState) =>
  state.address.userAddressesStatus;
export const selectAddAddressStatus = (state: RootState) =>
  state.address.addAddressStatus;
export const selectGetTransactionsByAddressStatus = (state: RootState) =>
  state.address.getTransactionsByAddressStatus;
export const selectGetAddressStatus = (state: RootState) =>
  state.address.getAddressStatus;
export const selectGetBalanceMultiStatus = (state: RootState) =>
  state.address.getBalanceMultiStatus;
export const selectUpdateAddressStatus = (state: RootState) =>
  state.address.updateAddressStatus;
export const selectDeleteAddressStatus = (state: RootState) =>
  state.address.deleteAddressStatus;

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

export const getAddressData =
  (addressId: string): AppThunk =>
  async (dispatch, _getState) => {
    const result = await dispatch(getAddressAsync(addressId));
    if (result.meta.requestStatus === "fulfilled") {
      const address: AddressProps = result.payload;
      const getTxResult = await dispatch(
        getTransactionsByAddressAsync(address.address)
      );
      if (getTxResult.meta.requestStatus === "fulfilled") {
        const transactions = getTxResult.payload;
        transactions.result?.forEach((tx: any) => {
          if (tx.timeStamp && isOldWallet(tx.timeStamp)) {
            dispatch(setAddressIsOld(true));
          }
        });
      }
      const balances = await dispatch(getBalanceMultiAsync([address.address]));
      if (balances.meta.requestStatus === "fulfilled") {
        const balance = balances.payload.result?.[0].balance;
        const inEth = weiToEth(balance?.toString());
        dispatch(setCurrentBalance(inEth));
      }
    }
  };

export default addressSlice.reducer;
