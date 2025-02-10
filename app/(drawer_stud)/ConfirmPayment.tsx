import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import paymentConfirm from "@/utils/paymentConfirm";
import { useAtomValue } from "jotai";
import payDataAtom from "@/utils/GlobalState";

const ConfirmPayment = () => {
  const paymentData = useAtomValue(payDataAtom);
  return (
    paymentData && (
      // If the shop has generated the offer, show this view.
      <View style={styles.card}>
        <Text style={styles.title}>Payment Details</Text>
        <Text style={styles.text}>Payment ID: {paymentData.payment_id}</Text>
        <Text style={styles.text}>Offer ID: {paymentData.offer_id}</Text>
        <Text style={styles.text}>
          Offer Amount: {paymentData.offer_amount}
        </Text>
        <Text style={styles.text}>
          Remaining Amount: {paymentData.remaining_amount_to_pay}
        </Text>
        <Text style={styles.text}>Message: {paymentData.message}</Text>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => paymentConfirm(paymentData.payment_id)}
        >
          <Text style={styles.text}>Confirm</Text>
        </TouchableOpacity>
      </View>
    )
  );
};

export default ConfirmPayment;

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
    width: "80%",
    bottom: 50,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
