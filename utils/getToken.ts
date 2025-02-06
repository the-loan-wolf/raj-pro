import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getToken = async () => {
  let token;
  try {
    if (Platform.OS === "web") {
      token = await AsyncStorage.getItem("authToken");
      if (token) {
        // console.log("Retrieved Token:", token);
        return token;
      } else {
        console.log("No token found");
      }
    } else {
      token = await SecureStore.getItemAsync("authToken");
      if (token) {
        // console.log("Retrieved Token:", token);
        return token;
      } else {
        console.log("No token found");
      }
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

export default getToken;
