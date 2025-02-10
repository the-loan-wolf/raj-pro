import WatingForTransaction from "@/app/(drawer_stud)/watingForTransaction";
import { PaymentData } from "@/utils/type";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
type Props = {
  min: string;
  max: string;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  handleVerify: () => Promise<void>;
};
const AmountField = ({ min, max, amount, setAmount, handleVerify }: Props) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Back Navigation Button*/}
      <TouchableOpacity
        style={styles.back_home}
        onPress={() => router.replace("./(tabs)")}
      >
        <Text>Back to Home</Text>
      </TouchableOpacity>
      {/* Show this View to enter the Amount for which offer should be
            generated*/}
      <View style={styles.card}>
        <Text style={styles.title}>Please Enter Details!</Text>
        <Text style={styles.subtitle}>
          Enter the purchase amount to verify within the offer range {min}% to{" "}
          {max}%
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8EDED",
  },
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
  subtitle: {
    fontSize: 16,
    color: "#0A3981",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#0A3981",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#0A3981",
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#D4A373",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
  back_home: {
    marginLeft: 40,
    marginBottom: 130,
    backgroundColor: "#98D8EF",
  },
});

export default AmountField;
