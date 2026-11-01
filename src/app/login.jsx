
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../constants/Api";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const cleanPhone = phone.trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      Alert.alert(
        "Invalid Number",
        "Enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: cleanPhone,
        }),
      });

      // Development debugging
      console.log("SEND OTP RESPONSE:", JSON.stringify(data));

      if (data?.testOtp) {
        Alert.alert(
          "Testing OTP",
          `Your OTP is: ${data.testOtp}`,
          [
            {
              text: "Continue",
              onPress: () => {
                router.push({
                  pathname: "/otp",
                  params: { phone: cleanPhone },
                });
              },
            },
          ]
        );
      } else {
        router.push({
          pathname: "/otp",
          params: { phone: cleanPhone },
        });
      }
    } catch (error) {
      Alert.alert(
        "OTP Error",
        error instanceof Error
          ? error.message
          : "Unable to send OTP. Please try again."
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

        <View style={styles.logoBox}>
          <Text style={styles.logo}>C</Text>
        </View>

        <Text style={styles.title}>Welcome back!</Text>

        <Text style={styles.subtitle}>
          Login to continue chatting with your friends.
        </Text>

        <Text style={styles.label}>Mobile Number</Text>

        <View style={styles.phoneBox}>
          <Text style={styles.countryCode}>🇮🇳 +91</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#668180"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={(value) =>
              setPhone(value.replace(/\D/g, "").slice(0, 10))
            }
            editable={!loading}
          />
        </View>

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#062020" />
          ) : (
            <>
              <Text style={styles.buttonText}>Continue</Text>
              <Text style={styles.arrow}>→</Text>
            </>
          )}
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.muted}>
            Don't have an account?{" "}
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Create Account",
                "Enter your mobile number above and press Continue. After OTP verification, you can create your account."
              )
            }
            disabled={loading}
          >
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
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
    paddingTop: 55,
    paddingBottom: 35,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0B2929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
  },
  logoBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  logo: {
    color: "#062020",
    fontSize: 34,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8BA7A5",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 38,
  },
  label: {
    color: "#D7E5E3",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  phoneBox: {
    height: 57,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#234747",
    backgroundColor: "#0B2929",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  countryCode: {
    color: "#FFFFFF",
    fontSize: 13,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    height: "100%",
  },
  button: {
    height: 56,
    backgroundColor: "#18D6D1",
    borderRadius: 16,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
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
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
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
  note: {
    color: "#557775",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 17,
    marginTop: "auto",
    paddingTop: 45,
  },
});
