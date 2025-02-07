import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useRouter } from "expo-router";
import checkStatusOfLastTransaction from "@/utils/checkStatusOfLastTransaction";
import WatingForTransaction from "./watingForTransaction";
import { PaymentData } from "@/utils/type";
import fetchOfferDetails from "@/utils/fetchOfferDetails";
import getToken from "@/utils/getToken";

// const initialState = {
//   amount: string;

// }

const Amount = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [amount, setAmount] = useState<string>("");
  const [id, setId] = useState<string>(""); // Shop ID
  const [min, setMin] = useState<string>(""); // Min offer range
  const [max, setMax] = useState<string>(""); // Max offer range
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<number>(); // Store payment ID properly
  const [isTransactionInProcess, setIsTransactionInProcess] = useState<
    boolean | null
  >(null);
  const params = useLocalSearchParams();
  // const [state, dispatch] = useReducer();

  useFocusEffect(() => {
    navigation.setOptions({ headerShown: true });

    if (params.id) setId(params.id as string);
    if (params.min) setMin(params.min as string);
    if (params.max) setMax(params.max as string);
  });

  const handleVerify = async () => {
    if (!id.trim() || !amount.trim() || isNaN(Number(amount))) {
      Alert.alert("Error", "Please enter a valid ID and numeric amount.");
      return;
    }

    try {
      setVerifying(true);
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        setVerifying(false);
        return;
      }

      const response = await fetch(
        "http://54.211.207.66/api/v1/payment/payment_offline/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shop_id: id, payable_amount: amount }),
        }
      );

      const data = await response.json();
      console.log("amount route - Verification API Response:", data);

      if (data.status === 201) {
        setIsVerified(true);
        setPaymentId(data.data.payment_id); // Set Payment ID
        router.replace(`./watingForTransaction?id=${paymentId}`);
      } else {
        Alert.alert("Error", data.message || "Payment verification failed.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "An error occurred while processing the payment.");
    } finally {
      setVerifying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setAmount("");
      setPaymentId(undefined);
      setIsVerified(false);
      setIsTransactionInProcess(false);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const checkTransaction = async () => {
        if (!id) {
          console.warn("Invalid ID");
          return;
        }
        const result = await checkStatusOfLastTransaction(id);
        if (result) {
          setPaymentId(result);
        }
        setIsTransactionInProcess(result ? true : false);
      };

      checkTransaction();
    }, [id])
  );

  console.log("amount route - isTransactionInProcess:", isTransactionInProcess);

  if (isTransactionInProcess) {
    return paymentId && <WatingForTransaction id={paymentId} />;
  } else {
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
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={verifying || isVerified}
          >
            <Text style={styles.buttonText}>
              {verifying || isVerified ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
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

export default Amount;
