import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { Shop } from "../utils/type";
import formatTime from "../utils/formatTime";
import { Link } from "expo-router";

const RenderShop = ({ item }: { item: Shop }) => {
  const { id, min_discount, max_discount } = item;

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
        <Link
          replace
          href={`./amount?id=${id}&min=${min_discount}&max=${max_discount}`}
          style={styles.selectButton}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Link>
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
    textAlign: "center",
  },
});

export default RenderShop;
