import { Tabs, router } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor="#FADA7A" />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
          tabBarLabel: "Home",
          headerTitle: "Please Verify Transaction",
        }}
      />
      <Tabs.Screen
        name="off_created"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={24} color={color} />
          ),
          tabBarLabel: "Created",
          headerTitle: "Find Offer Created",
        }}
      />
      <Tabs.Screen
        name="off_settled"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
          tabBarLabel: "Settled",
          headerTitle: "Your Total Transaction",
        }}
      />
    </Tabs>
  );
}
