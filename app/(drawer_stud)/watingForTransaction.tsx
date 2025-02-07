import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";
import getToken from "@/utils/getToken";
import { useEffect, useState } from "react";
import fetchOfferDetails from "@/utils/fetchOfferDetails";
import { PaymentData } from "@/utils/type";
import paymentConfirm from "@/utils/paymentConfirm";

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
    // If the shop has generated the offer, show this view.
    <View style={styles.card}>
      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.text}>Payment ID: {paymentData.payment_id}</Text>
      <Text style={styles.text}>Offer ID: {paymentData.offer_id}</Text>
      <Text style={styles.text}>Offer Amount: {paymentData.offer_amount}</Text>
      <Text style={styles.text}>
        Remaining Amount: {paymentData.remaining_amount_to_pay}
      </Text>
      <Text style={styles.text}>Message: {paymentData.message}</Text>
      <TouchableOpacity style={styles.verifyButton} onPress={() => paymentConfirm(paymentId)}>
        <Text style={styles.text}>Confirm</Text>
      </TouchableOpacity>
    </View>
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
  card: {
    width: "90%",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3981",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#0A3981",
    marginBottom: 10,
  },
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
