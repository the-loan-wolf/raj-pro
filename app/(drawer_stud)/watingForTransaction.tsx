import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";
import getToken from "@/utils/getToken";
type Props = {
  id: number;
};
const WatingForTransaction = ({ id }: Props) => {
  const router = useRouter();
  const handleVerify = async () => {
    try {
      const token = await getToken()
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return false;
      }

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
  return (
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
