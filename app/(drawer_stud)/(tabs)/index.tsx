import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Shop } from "@/utils/type";
import fetchShops from "@/utils/fetchShops";
import RenderShop from "@/components/RenderShop";

const Landing = () => {
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
    if (address == " ") {
      setFilteredShops(shops);
    } else {
      setFilteredShops(shops.filter((shop) => shop.address === address));
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
              renderItem={({ item }) => <RenderShop item={item} />}
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
    justifyContent: "center",
    alignItems: "center",
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
