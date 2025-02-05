import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install this package if not already installed
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Shop } from "@/utils/type";
import fetchShops from "@/utils/fetchShops";
import renderShop from "@/utils/renderShop";

const Landing = () => {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [uniqueAddresses, setUniqueAddresses] = useState<string[]>([]);

  useEffect(() => {
    fetchShops({ setShops, setFilteredShops, setUniqueAddresses, setLoading });
  }, []);

  const handleAddressFilter = (address: string) => {
    setSelectedAddress(address);
    console.log(address);
    // console.log(shops)
    if (address == " ") {
      setFilteredShops(shops);
    } else {
      setFilteredShops(shops.filter((shop) => shop.address === address));
    }
  };

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return;
      }

      const response = await axios.post(
        "http://54.211.207.66/api/v1/auth/logout/",
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        await SecureStore.deleteItemAsync("authToken");
        Alert.alert("Logged Out", "You have successfully logged out.");
        router.push("../signin");
      } else {
        Alert.alert("Error", response.data.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  };

  const handleSelect = async (id: string, min: string, max: string) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return;
      }

      const response = await axios.get(
        `http://54.211.207.66/api/v1/Shop/shops/${id}/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        const shopDetails = response.data.data;
        // Alert.alert('Shop Details', `You selected ${shopDetails.shop_name}.`);
        router.replace(`./amount?id=${id}&min=${min}&max=${max}`);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch shop details."
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Fetching shop details failed.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00A86B" />
      ) : (
        <>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(itemValue) => handleAddressFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Addresses" value=" " />
            {uniqueAddresses.map((address, index) => (
              <Picker.Item key={index} label={address} value={address} />
            ))}
          </Picker>

          {filteredShops.length > 0 ? (
            <FlatList
              data={filteredShops}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return renderShop({ item, handleSelect });
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>
              No shops available for the selected address.
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D4EBF8",
    paddingHorizontal: 16,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#A6AEBF",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#B03052",
    padding: 8,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: width * 0.9,
    alignSelf: "center",
    marginVertical: 10,
    // Add border width
    // Set border color
    borderRadius: 5, // Optional: for rounded corners
    backgroundColor: "white",
    borderColor: "black", // Set border color
    borderWidth: 5, // Set border width to make it visible // Optional: set background color
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default Landing;
