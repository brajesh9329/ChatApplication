
import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest, setAuthToken } from "../constants/Api";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const { phone } = useLocalSearchParams();
  const phoneNumber = Array.isArray(phone) ? phone[0] : phone;

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
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

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (!phoneNumber) {
      Alert.alert("Error", "Phone number missing. Please try again.");
      return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
      Alert.alert("Invalid OTP", "Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Verify OTP
      const verification = await apiRequest("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: String(phoneNumber),
          otp: enteredOtp,
        }),
      });

      if (verification.registered) {
        // Step 2: Login existing user
        const user = await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: String(phoneNumber),
          }),
        });

        // Step 3: Save JWT token
        if (!user.token) {
          throw new Error("Login response mein JWT token missing hai.");
        }

        setAuthToken(user.token);

        if (user.userId == null) {
          throw new Error("Login response mein user ID missing hai.");
        }

        Alert.alert("Success", "Login successful!", [
          {
            text: "Continue",
            onPress: () =>
              router.replace({
                pathname: "/home",
                params: {
                  userId: String(user.userId),
                  name: user.name ?? "",
                  phone: String(phoneNumber),
                },
              }),
          },
        ]);
      } else {
        // New user: Continue to signup
        router.replace({
          pathname: "/signup",
          params: {
            phone: String(phoneNumber),
          },
        });
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.message || "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number missing.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: String(phoneNumber),
        }),
      });

      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();

      if (data.testOtp) {
        Alert.alert("Testing OTP", `Your new OTP is: ${data.testOtp}`);
      } else {
        Alert.alert("OTP", "A new OTP has been requested.");
      }
    } catch (error) {
      Alert.alert(
        "Resend Failed",
        error.message || "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
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
          disabled={loading}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>✉</Text>
        </View>

        <Text style={styles.title}>Verify your number</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit verification code for +91 {phoneNumber}.
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
              editable={!loading}
            />
          ))}
        </View>

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#062020" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                Verify & Continue
              </Text>
              <Text style={styles.arrow}>→</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.resendButton}
          onPress={handleResend}
          disabled={loading}
        >
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            <Text style={styles.link}>Resend OTP</Text>
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Development testing only — OTP is generated by the backend.
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
  disabledButton: {
    opacity: 0.7,
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
