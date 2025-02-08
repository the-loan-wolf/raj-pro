import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import getToken from "@/utils/getToken";

interface Payment {
  payment_id: string;
  student_name: string;
  shop_name: string;
  payable_amount: string;
  payment_status: string;
  payment_date: string;
  payment_received: boolean;
  min_discount: number;
  max_discount: number;
}

const PaymentsReceived: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert("Error", "Authentication token is missing.");
          return;
        }

        const response = await axios.get<{
          status: number;
          data: { results: Payment[] };
        }>("http://54.211.207.66/api/v1/Shop/shop/All_payments_recieved/", {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.data.status === 200) {
          setPayments(response.data.data.results);
        } else {
          Alert.alert("Error", "Failed to fetch payments.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        Alert.alert("Error", "An error occurred while fetching payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00A86B" />
      ) : payments.length > 0 ? (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.payment_id}
          renderItem={({ item }) => (
            <View style={styles.paymentCard}>
              <Text style={styles.text}>Student: {item.student_name}</Text>
              <Text style={styles.text}>Shop: {item.shop_name}</Text>
              <Text style={styles.text}>Amount: ₹{item.payable_amount}</Text>
              <Text style={styles.text}>Status: {item.payment_status}</Text>
              <Text style={styles.text}>
                Received: {item.payment_received ? "Yes" : "No"}
              </Text>
              <Text style={styles.text}>
                Date: {new Date(item.payment_date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No payments received.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#D4EBF8",
  },
  paymentCard: {
    backgroundColor: "#F5EFFF",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    borderColor: "black",
    borderWidth: 0.2,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default PaymentsReceived;
