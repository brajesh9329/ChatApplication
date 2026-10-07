import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

const settings = [
  ["👤", "Account", "Manage your account"],
  ["🔔", "Notifications", "Messages and alerts"],
  ["🔒", "Privacy & Security", "Control your privacy"],
  ["🎨", "Appearance", "Theme and display"],
  ["💾", "Storage & Data", "Manage storage"],
  ["❓", "Help & Support", "Get help"],
];

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>
      </View>

      {settings.map((item) => (
        <Pressable key={item[1]} style={styles.option}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{item[0]}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.optionTitle}>{item[1]}</Text>
            <Text style={styles.description}>{item[2]}</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}

      <Pressable style={styles.logout}>
        <Text style={styles.logoutIcon}>↪</Text>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <Text style={styles.version}>ChatFlow • Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },

  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 38,
    marginRight: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
  },

  option: {
    minHeight: 72,
    backgroundColor: "#0B2929",
    borderRadius: 18,
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#193F3F",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#123939",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 18,
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  optionTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    color: "#708B8A",
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    color: "#718B8A",
    fontSize: 27,
  },

  logout: {
    height: 58,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#603333",
    backgroundColor: "#211919",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutIcon: {
    color: "#FF7777",
    fontSize: 20,
    marginRight: 9,
  },

  logoutText: {
    color: "#FF7777",
    fontSize: 14,
    fontWeight: "700",
  },

  version: {
    color: "#496968",
    textAlign: "center",
    marginTop: 25,
    fontSize: 11,
  },
});