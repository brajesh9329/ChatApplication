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

        <Text style={styles.heading}>Create account</Text>

        <Text style={styles.subheading}>
          Create your account and start chatting
        </Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>

          <View style={styles.plus}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#648180"
        />

        <Text style={styles.label}>Mobile Number</Text>

        <View style={styles.phoneContainer}>
          <Text style={styles.country}>+91</Text>

          <TextInput
            style={styles.phoneInput}
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
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.normalText}>
            Already have an account?
          </Text>

          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.login}> Login</Text>
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

  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 28,
  },

  subheading: {
    color: "#8CAAA9",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 22,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#153838",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 27,
    borderWidth: 1,
    borderColor: "#2E5555",
  },

  avatarText: {
    fontSize: 35,
  },

  plus: {
    position: "absolute",
    right: -2,
    bottom: -1,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },

  plusText: {
    color: "#062020",
    fontSize: 20,
    fontWeight: "800",
  },

  label: {
    color: "#D5E3E2",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 9,
    marginTop: 13,
  },

  input: {
    height: 57,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#315454",
    backgroundColor: "#102B2B",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 15,
  },

  phoneContainer: {
    height: 57,
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
    fontWeight: "700",
    paddingRight: 13,
    borderRightWidth: 1,
    borderRightColor: "#315454",
  },

  phoneInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingLeft: 13,
  },

  button: {
    height: 57,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#062020",
    fontSize: 16,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  normalText: {
    color: "#789493",
    fontSize: 14,
  },

  login: {
    color: "#18D6D1",
    fontWeight: "700",
    fontSize: 14,
  },
});