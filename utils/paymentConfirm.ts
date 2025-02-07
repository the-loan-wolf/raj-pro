import { Alert } from "react-native";
import getToken from "./getToken";
import { router } from "expo-router";

const paymentConfirm = async (paymentId: number | undefined) => {
  if (!paymentId) {
    Alert.alert("Error", "No valid payment ID found.");
    return;
  }

  try {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    const response = await fetch(
      `http://54.211.207.66/api/v1/payment/student/payment_Offer_taken/${paymentId}/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
          body: JSON.stringify({ payment_id: paymentId}),
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      Alert.alert("Success", "Offer confirmed successfully!");
      router.push("/(drawer_stud)/thanks"); // Navigate to thank.tsx
    } else {
      // Ensure that only one error message is shown
      Alert.alert("Error", data.message || "Failed to confirm the offer.");
      console.log("paymentConfirm - Failed to confirm the offer: ",data);
    }
  } catch (error) {
    console.error("API Error:", error);
    Alert.alert("Error", "An error occurred while confirming the offer.");
  }
};

export default paymentConfirm;
