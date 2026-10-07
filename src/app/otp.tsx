import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function OtpScreen() {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹</Text>
      </Pressable>

      <View style={styles.icon}>
        <Text style={styles.iconText}>✓</Text>
      </View>

      <Text style={styles.heading}>Verify your number</Text>

      <Text style={styles.description}>
        We've sent a 6-digit verification code to
      </Text>

      <Text style={styles.number}>+91 XXXXXXX210</Text>

      <View style={styles.otpRow}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <TextInput
            key={item}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.buttonText}>Verify & Continue</Text>
      </Pressable>

      <Text style={styles.resendText}>
        Didn't receive the code?
      </Text>

      <Pressable>
        <Text style={styles.resend}>Resend OTP</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingHorizontal: 27,
    paddingTop: 55,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 38,
    height: 45,
  },

  icon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#123A39",
    borderWidth: 1,
    borderColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
    marginBottom: 28,
  },

  iconText: {
    color: "#18D6D1",
    fontSize: 34,
    fontWeight: "800",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },

  description: {
    color: "#8CAAA9",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },

  number: {
    color: "#18D6D1",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 38,
  },

  otpInput: {
    width: 46,
    height: 56,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#315454",
    backgroundColor: "#102B2B",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },

  button: {
    height: 57,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#062020",
    fontSize: 16,
    fontWeight: "800",
  },

  resendText: {
    color: "#718E8D",
    textAlign: "center",
    marginTop: 30,
    fontSize: 13,
  },

  resend: {
    color: "#18D6D1",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
  },
});