import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Shop } from "../utils/type";
import formatTime from "../utils/formatTime";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const renderShop = ({ item }: { item: Shop }) => {
  const router = useRouter();

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
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtiYeQq82-HVJyUPwtunX9sjyW867mTdKvg&s",
          }} // Placeholder image
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.name}>{item.shop_name}</Text>
        <Text style={styles.address}>
          {item.address}, {item.zip_code}
        </Text>
        <Text style={styles.contact}>Contact: {item.contact_number}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <Text style={styles.hours}>
          Open: {formatTime(item.opening_time)} - Close:{" "}
          {formatTime(item.closing_time)}
        </Text>
        <Text style={styles.offer}>
          Offer Range {item.min_discount} to {item.max_discount}
        </Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() =>
            handleSelect(item.id, item.min_discount, item.max_discount)
          }
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F5EFFF",
    borderRadius: 12,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: "center",
    borderColor: "black", // Set border color
    borderWidth: 0.15, // Set border width to make it visible
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  hours: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  offer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: "#B03052",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default renderShop;
