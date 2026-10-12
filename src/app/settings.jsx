import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

const settings = [
  ["👤", "Account", "Manage your account", "/profile"],
  ["🔔", "Notifications", "Messages and alerts", null],
  ["🔒", "Privacy & Security", "Control your privacy", null],
  ["🎨", "Appearance", "Theme and display", null],
  ["💾", "Storage & Data", "Manage storage", null],
  ["❓", "Help & Support", "Get help", null],
];

export default function SettingsScreen() {
  const handleSettingPress = (route, title) => {
    if (route) {
      router.push(route);
    } else {
      Alert.alert(title, `${title} settings will be available soon.`);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>
      </View>

      {settings.map((item) => (
        <Pressable
          key={item[1]}
          style={({ pressed }) => [
            styles.option,
            pressed && styles.optionPressed,
          ]}
          onPress={() => handleSettingPress(item[3], item[1])}
        >
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

      <Pressable
        style={({ pressed }) => [
          styles.logout,
          pressed && styles.logoutPressed,
        ]}
        onPress={handleLogout}
      >
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
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0B2929",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 34,
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
  optionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
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
  logoutPressed: {
    opacity: 0.7,
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