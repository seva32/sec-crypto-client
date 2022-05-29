import axios from "axios";
import { AddressProps } from "../../components/Dashboard/AddressEditor";
import { balancemulti, txlist } from "../../utils/apis";
import { BASE_URL } from "../../utils/constants";

export function getAddreses(): Promise<{ data: AddressProps[] }> {
  const token = localStorage.getItem("token");
  return axios.get(`${BASE_URL}/address/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createAddress(formData: AddressProps) {
  const token = localStorage.getItem("token");
  return axios.post(`${BASE_URL}/address/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getTransactionsByAddress(address: string) {
  return axios.get(txlist(address), { withCredentials: true });
}

export function getAddress(addressId: string) {
  const token = localStorage.getItem("token");
  return axios.get(`${BASE_URL}/address/address/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getBalanceMulti(addresses: string[]) {
  return axios.get(balancemulti(addresses), { withCredentials: true });
}

export function updateAddress(formData: AddressProps) {
  const token = localStorage.getItem("token");
  return axios.put(`${BASE_URL}/address/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteAddress(addressId: string) {
  const token = localStorage.getItem("token");
  return axios.delete(`${BASE_URL}/address/delete/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
