import { Alert, Platform } from "react-native";
import getToken from "./getToken";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';

const handleLogout = async () => {
  try {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    const response = await axios.post(
      "http://54.211.207.66/api/v1/auth/logout/",
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 204) {
      Alert.alert("Logged Out", "You have successfully logged out.");
      router.push("../signin");
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem("authToken");
      } else {
        await SecureStore.deleteItemAsync("authToken");
      }
    } else {
      Alert.alert("Error", response.data.message || "Failed to log out.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    Alert.alert("Error", "An error occurred while logging out.");
  }
};

export default handleLogout;