// this function return true if last transaction was succesfull
// or if transaction time got over(which is 30min)
// if no transaction is in process it returns false else return paymentID
import { Alert } from "react-native";
import getToken from "./getToken";

type obj = {
  payment_id: number;
  student_id: number;
  student_name: string;
  shop_id: number;
  shop_name: string;
  payable_amount: string;
  payment_status: string;
  payment_date: string;
  payment_received: boolean;
  min_discount: number;
  max_discount: number;
};

const checkStatusOfLastTransaction = async (id: string) => {
  try {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return false;
    }

    const response = await fetch(
      "http://54.211.207.66/api/v1/payment/payments/",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response:", data);
      return false;
    }

    const filteredResult = data.data.filter(
      (obj: obj) => obj.shop_id === Number(id)
    );

    if (filteredResult.length === 0) {
      console.warn("checkStatusOfLastTransaction - No transactions found for shop_id:", id);
      return false;
    }

    const lastTransaction: obj = filteredResult.at(-1)!;
    console.log("checkStatusOfLastTransaction - last transaction details: ", lastTransaction);
    if (lastTransaction.payment_received) {
      return false;
    }
    const lastTransactionTime = new Date(lastTransaction.payment_date);
    const currentTime = new Date();
    const differenceInMilliSecond =
      currentTime.getTime() - lastTransactionTime.getTime();
    const diffMinutes = Math.floor(differenceInMilliSecond / (1000 * 60));

    console.log("checkStatusOfLastTransaction- Total minute since last transaction: ",diffMinutes);

    if (diffMinutes >= 30) {
      return false;
    } else {
      return lastTransaction.payment_id;
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return false;
  }
};

export default checkStatusOfLastTransaction;
