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
import WaitingForTransaction from "./waitingForTransaction";
import { PaymentData } from "@/utils/type";
import fetchOfferDetails from "@/utils/fetchOfferDetails";
import getToken from "@/utils/getToken";
import ConfirmPayment from "./ConfirmPayment";
import AmountField from "@/components/AmountField";
import { useAtom } from "jotai";
import payDataAtom from "@/utils/GlobalState";

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
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const params = useLocalSearchParams();
  // const [state, dispatch] = useReducer();
  const [payData, setPayData] = useAtom(payDataAtom);

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
        // console.log(data.data.payment_id);
        // console.log("paymentData:", paymentData);
        // console.log("paymentId:", paymentId);
        router.push(`./waitingForTransaction?paymentId=${data.data.payment_id}`);
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

  useEffect(() => {
    if (paymentId) {
      // Fetch offer details continuously
      const interval = setInterval(
        () => fetchOfferDetails(paymentId, setPayData),
        10000
      ); // Polling every 5 sec
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [paymentId]);

  useFocusEffect(
    useCallback(() => {
      setAmount("");
      setPaymentId(undefined);
      setIsVerified(false);
      setIsTransactionInProcess(false);
      setPayData(null);
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
    return paymentId && <WaitingForTransaction paymentId={paymentId} />;
  } else if (payData) {
    <ConfirmPayment />;
  } else {
    return (
      <AmountField
        min={min}
        max={max}
        amount={amount}
        setAmount={setAmount}
        handleVerify={handleVerify}
      />
    );
  }
};

export default Amount;
