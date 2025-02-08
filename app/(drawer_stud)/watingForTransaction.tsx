import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";
import getToken from "@/utils/getToken";
import { useEffect, useState } from "react";
import fetchOfferDetails from "@/utils/fetchOfferDetails";
import { PaymentData } from "@/utils/type";
import ConfirmPayment from "./ConfirmPayment";

type Props = {
  id: number;
};
const WatingForTransaction = ({ id }: Props) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const params = useLocalSearchParams();
  const paymentId = id ? id : Number(params.id as string);
  const router = useRouter();

  useEffect(() => {
    if (paymentId) {
      // Fetch offer details continuously
      const interval = setInterval(
        () => fetchOfferDetails(paymentId, setPaymentData),
        10000
      ); // Polling every 5 sec
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [paymentId]);

  const handleVerify = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return false;
      }

      console.log(id ? id : params.id);
      const response = await fetch(
        `http://54.211.207.66/api/v1/payment/payments/${paymentId}/cancel/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(id);
      const data = await response.json();

      if (response.status === 201) {
        Alert.alert("Order cancelled successfully");
        router.back();
      } else {
        Alert.alert("Error");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return paymentData ? (
    <ConfirmPayment paymentData={paymentData} />
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ marginBlockEnd: 50 }}>
        <LoadingSpinner />
      </View>
      <Text style={{ marginBlockEnd: 50 }}>
        Waiting for varification from Shopkeeper side...
      </Text>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.buttonText}>Cancle the Transaction!</Text>
      </TouchableOpacity>
    </View>
  );
};
export default WatingForTransaction;

const styles = StyleSheet.create({
  verifyButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
