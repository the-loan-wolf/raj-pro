import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

const paymentConfirm = async (paymentId: number | undefined) => {
  if (!paymentId) {
    Alert.alert("Error", "No valid payment ID found.");
    return;
  }

  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    const response = await fetch(
      `http://54.211.207.66/api/v1/payment/student/payment_Offer_taken/${paymentId}/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      Alert.alert("Success", "Offer confirmed successfully!");
      //   router.push("/(drawer_stud)/thanks"); // Navigate to thank.tsx
    } else {
      // Ensure that only one error message is shown
      Alert.alert("Error", data.message || "Failed to confirm the offer.");
    }
  } catch (error) {
    console.error("API Error:", error);
    Alert.alert("Error", "An error occurred while confirming the offer.");
  }
};

export default paymentConfirm;
