import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";
import getToken from "@/utils/getToken";
import { useEffect, useState } from "react";
import fetchOfferDetails from "@/utils/fetchOfferDetails";
import { PaymentData } from "@/utils/type";
import ConfirmPayment from "./ConfirmPayment";
import { useGlobalSearchParams } from "expo-router";

type Props = {
  paymentData: PaymentData | null;
  paymentId: number;
};
const WatingForTransaction = ({ paymentData, paymentId }: Props) => {

  // const [paymentData2, setPaymentData2] = useState<PaymentData | null>(null);
  const params = useLocalSearchParams();
  const id = paymentId || Number(params.paymentId)
  console.log("params :", params);
  const data = null;
  // const data = paymentData || JSON.parse(params.paymentData as string) as PaymentData;
  // let parsedPaymentId: number = 0; // Default value to prevent undefined issues

  // if (params.paymentId) {
  //   try {
  //     const parsedValue = Number(params.paymentId); // Convert to number safely
  //     if (!isNaN(parsedValue)) {
  //       parsedPaymentId = parsedValue;
  //     } else {
  //       console.error(
  //         "Invalid paymentId format: Not a number",
  //         params.paymentId
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error parsing paymentId", error);
  //   }
  // }

  // useEffect(() => {
  //   // Fetch offer details continuously
  //   const interval = setInterval(() => {
  //     fetchOfferDetails(id, setPaymentData2);
  //     console.log("fetching is working in waiting route");
  //   }, 10000); // Polling every 5 sec
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [paymentData2]);

  // const data = paymentData || paymentData2;
  // console.log("this line will print if this line evaluate (const data = paymentData || paymentData2;)")
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return false;
      }

      // console.log(id ? id : params.id);
      const response = await fetch(
        `http://54.211.207.66/api/v1/payment/payments/${id}/cancel/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(id);
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
  return data ? (
    <ConfirmPayment paymentData={data} />
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
