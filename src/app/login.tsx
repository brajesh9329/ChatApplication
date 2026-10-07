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

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <View style={styles.logo}>
          <Text style={styles.logoText}>✦</Text>
        </View>

        <Text style={styles.heading}>Welcome back!</Text>

        <Text style={styles.subheading}>
          Login to continue chatting
        </Text>

        <Text style={styles.label}>Mobile Number</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.country}>+91</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#648180"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/otp")}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.info}>
          We'll send you a one-time verification code
          to verify your mobile number.
        </Text>

        <View style={styles.signupRow}>
          <Text style={styles.normalText}>
            Don't have an account?
          </Text>

          <Pressable onPress={() => router.push("/signup")}>
            <Text style={styles.signup}> Sign Up</Text>
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

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 27,
    paddingTop: 55,
    paddingBottom: 30,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 38,
    height: 45,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 24,
  },

  logoText: {
    fontSize: 32,
    color: "#062020",
    fontWeight: "bold",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subheading: {
    color: "#8CAAA9",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 38,
  },

  label: {
    color: "#D5E3E2",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 9,
  },

  inputContainer: {
    height: 58,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#315454",
    backgroundColor: "#102B2B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  country: {
    color: "#18D6D1",
    fontSize: 15,
    fontWeight: "700",
    paddingRight: 13,
    borderRightWidth: 1,
    borderRightColor: "#315454",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingLeft: 13,
  },

  button: {
    height: 57,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#062020",
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    color: "#062020",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#234343",
  },

  or: {
    color: "#668382",
    fontSize: 12,
    marginHorizontal: 14,
  },

  info: {
    color: "#708D8C",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  normalText: {
    color: "#789493",
    fontSize: 14,
  },

  signup: {
    color: "#18D6D1",
    fontWeight: "700",
    fontSize: 14,
  },
});