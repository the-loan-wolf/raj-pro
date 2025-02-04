import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
const CustomDrawerContent = (props:any) => {
  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props}>
      
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="info"
            size={size}
            color={pathname == "/index" ? "#fff" : "#000"}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/index" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/index" ? "#E8F9FF" : "#fff" }}
        onPress={() => {
          router.push('/');
        }}
      />
     
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign name="profile" size={24} color="black" />
        )}
        label={"offer created"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/off_created" ? "#2973B2" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/off_created" ? "#E8F9FF" : "#fff" }}
        onPress={() => {
          router.push('/(drawer_shop)/(tabs)/off_created');
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="info"
            size={size}
            color={pathname == "/off_settled" ? "#fff" : "#000"}
          />
        )}
        label={"Transaction"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/off_settled" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/off_settled" ? "#333" : "#fff" }}
        onPress={() => {
          router.push('/(drawer_shop)/(tabs)/off_settled');
        }}
      />
       <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="info"
            size={size}
            color={pathname == "/help" ? "#fff" : "#000"}
          />
        )}
        label={"help"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/help" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/help" ? "#333" : "#fff" }}
        onPress={() => {
          router.push('/help');
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname == "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/profile");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="help" options={{ title: "Help Desk", headerShown: true }} />
      <Drawer.Screen name="index" options={{ title: "Home", headerShown: true }} />
      <Drawer.Screen name="profile" options={{ title: "Profile Details", headerShown: true }} />
    </Drawer>
  );
}


const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
    padding:10
  },
});
