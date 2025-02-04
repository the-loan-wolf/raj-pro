import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname == "/index" ? "#fff" : "#000"}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/index" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/index" ? "#F8E7F6" : "#fff" }}
        onPress={() => {
          router.push("/");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign name="profile" size={24} color="black" />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer_stud)/(tabs)/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons name="explore" size={24} color="black" />
        )}
        label={"Explore"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/features" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/features" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer_stud)/(tabs)/features");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="cart-arrow-down"
            size={24}
            color="black"
          />
        )}
        label={"Your Orders"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/total_transaction" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname == "/total_transaction" ? "#333" : "#fff",
        }}
        onPress={() => {
          router.push("/total_transaction");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <SimpleLineIcons name="settings" size={24} color="black" />
        )}
        label={"Setting"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/place" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/place" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/place");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* <Drawer.Screen name="place" options={{ headerShown: true }} /> */}
      <Drawer.Screen
        name="index"
        options={{ title: "Welcome Student!", headerShown: true }}
      />
      {/* <Drawer.Screen name="total_transaction" options={{ headerShown: true }} /> */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
    paddingLeft: 20,
  },
});
