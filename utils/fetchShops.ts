import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Dispatch } from "react";
import { Shop } from "./type";

type fetchShopsProps = {
  setShops: Dispatch<React.SetStateAction<Shop[]>>;
  setFilteredShops: Dispatch<React.SetStateAction<Shop[]>>;
  setUniqueAddresses: Dispatch<React.SetStateAction<string[]>>;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
};

const fetchShops = async ({
  setShops,
  setFilteredShops,
  setUniqueAddresses,
  setLoading,
}: fetchShopsProps) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }
    const response = await axios.get(
      "http://54.211.207.66/api/v1/Shop/shops/",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.data.status === 200) {
      const shopData = response.data.data as Shop[]; // Explicitly cast response data to Shop[]
      setShops(shopData);
      setFilteredShops(shopData);
      const addresses = Array.from(
        new Set(shopData.map((shop) => shop.address))
      ) as string[]; // Explicitly cast as string[]
      setUniqueAddresses(addresses);
    } else {
      Alert.alert("Error", response.data.message || "Failed to fetch shops.");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    Alert.alert("Error", "An error occurred while fetching shop data.");
  } finally {
    setLoading(false);
  }
};

export default fetchShops;
