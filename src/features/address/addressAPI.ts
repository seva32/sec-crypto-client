import axios from "axios";
import { AddressProps } from "../../components/Dashboard/AddressEditor";
import { txlist } from "../../utils/apis";
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
  return axios.get(txlist(address));
}
