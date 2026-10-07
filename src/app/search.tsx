import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Find Someone</Text>
      </View>

      <Text style={styles.heading}>Search by mobile number</Text>

      <Text style={styles.description}>
        Enter the mobile number of the person you want to chat with.
      </Text>

      <View style={styles.searchBox}>
        <Text style={styles.country}>+91</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#648180"
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.searchIcon}>⌕</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Search User</Text>
      </Pressable>

      <View style={styles.result}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.name}>Rahul Sharma</Text>
          <Text style={styles.number}>+91 9876543210</Text>
        </View>

        <Pressable
          style={styles.chatButton}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.chatText}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingTop: 55,
    paddingHorizontal: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 45,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 38,
    marginRight: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
  },

  description: {
    color: "#799594",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 25,
  },

  searchBox: {
    height: 57,
    backgroundColor: "#102B2B",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#315454",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  country: {
    color: "#18D6D1",
    fontWeight: "700",
    paddingRight: 12,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  searchIcon: {
    color: "#18D6D1",
    fontSize: 26,
  },

  button: {
    height: 55,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#062020",
    fontWeight: "800",
    fontSize: 15,
  },

  result: {
    marginTop: 35,
    padding: 14,
    backgroundColor: "#0B2929",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#194040",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  userInfo: {
    flex: 1,
    marginLeft: 13,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  number: {
    color: "#789493",
    fontSize: 12,
    marginTop: 5,
  },

  chatButton: {
    backgroundColor: "#18D6D1",
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 13,
  },

  chatText: {
    color: "#062020",
    fontWeight: "800",
  },
});