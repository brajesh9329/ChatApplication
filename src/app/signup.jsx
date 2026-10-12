import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join ChatFlow and start a conversation.
        </Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
          <View style={styles.cameraBadge}>
            <Text style={styles.camera}>＋</Text>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#668180"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneBox}>
          <Text style={styles.countryCode}>🇮🇳 +91</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter mobile number"
            placeholderTextColor="#668180"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/otp")}
        >
          <Text style={styles.buttonText}>Create Account</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.muted}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.link}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },
  content: {
    flexGrow: 1,
    padding: 25,
    paddingTop: 50,
    paddingBottom: 35,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0B2929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 27,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8BA7A5",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#123939",
    borderWidth: 1,
    borderColor: "#285252",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 28,
    position: "relative",
  },
  avatarText: {
    fontSize: 36,
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    color: "#062020",
    fontSize: 21,
    fontWeight: "700",
  },
  label: {
    color: "#D7E5E3",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
    marginTop: 17,
  },
  input: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#234747",
    backgroundColor: "#0B2929",
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 14,
  },
  phoneBox: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#234747",
    backgroundColor: "#0B2929",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    color: "#FFFFFF",
    fontSize: 13,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    color: "#FFFFFF",
    height: "100%",
    fontSize: 14,
  },
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#18D6D1",
    marginTop: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#062020",
    fontSize: 15,
    fontWeight: "800",
  },
  arrow: {
    color: "#062020",
    fontSize: 22,
    marginLeft: 10,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 27,
  },
  muted: {
    color: "#8BA7A5",
    fontSize: 13,
  },
  link: {
    color: "#18D6D1",
    fontSize: 13,
    fontWeight: "800",
  },
});