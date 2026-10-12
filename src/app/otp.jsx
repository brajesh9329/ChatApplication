import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const updatedOtp = [...otp];

    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>✉</Text>
        </View>

        <Text style={styles.title}>Verify your number</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to your mobile number.
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit ? styles.activeInput : null,
              ]}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.buttonText}>Verify & Continue</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.resendButton}
          onPress={() => {
            setOtp(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
          }}
        >
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            <Text style={styles.link}>Resend OTP</Text>
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Demo UI only — OTP is not sent or verified yet.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },
  content: {
    flex: 1,
    padding: 25,
    paddingTop: 55,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0B2929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: "#123939",
    borderWidth: 1,
    borderColor: "#285252",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  icon: {
    color: "#18D6D1",
    fontSize: 29,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8BA7A5",
    fontSize: 13,
    lineHeight: 22,
    marginTop: 12,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
  },
  otpInput: {
    width: 43,
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#234747",
    backgroundColor: "#0B2929",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  activeInput: {
    borderColor: "#18D6D1",
    backgroundColor: "#103535",
  },
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#18D6D1",
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#062020",
    fontSize: 14,
    fontWeight: "800",
  },
  arrow: {
    color: "#062020",
    fontSize: 22,
    marginLeft: 10,
  },
  resendButton: {
    marginTop: 25,
    alignItems: "center",
  },
  resendText: {
    color: "#8BA7A5",
    fontSize: 12,
  },
  link: {
    color: "#18D6D1",
    fontWeight: "800",
  },
  note: {
    color: "#557775",
    fontSize: 10,
    textAlign: "center",
    marginTop: 30,
  },
});