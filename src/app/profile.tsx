import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profile}>
        <Image
          source={{ uri: "https://i.pravatar.cc/200?img=12" }}
          style={styles.avatar}
        />

        <Text style={styles.name}>Rahul Sharma</Text>
        <Text style={styles.number}>+91 9876543210</Text>

        <View style={styles.online}>
          <View style={styles.dot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>About</Text>
        <Text style={styles.about}>Available for a chat 😊</Text>
      </View>

      <Pressable
        style={styles.option}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.icon}>✎</Text>
        <Text style={styles.optionText}>Edit Profile</Text>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.icon}>⚙</Text>
        <Text style={styles.optionText}>Settings</Text>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingTop: 60,
    paddingHorizontal: 22,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  profile: {
    alignItems: "center",
    marginTop: 35,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 53,
    borderWidth: 3,
    borderColor: "#18D6D1",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
  },

  number: {
    color: "#789493",
    marginTop: 5,
  },

  online: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#18D6D1",
    marginRight: 6,
  },

  onlineText: {
    color: "#18D6D1",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#0B2929",
    borderRadius: 18,
    padding: 18,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#193F3F",
  },

  label: {
    color: "#789493",
    fontSize: 12,
  },

  about: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 8,
  },

  option: {
    height: 60,
    backgroundColor: "#0B2929",
    borderRadius: 17,
    marginTop: 10,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#193F3F",
  },

  icon: {
    color: "#18D6D1",
    fontSize: 20,
    width: 35,
  },

  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
  },

  arrow: {
    color: "#718B8A",
    fontSize: 25,
  },
});