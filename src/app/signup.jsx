
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
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest, setAuthToken } from "../constants/Api";

export default function SignupScreen() {
  const { phone } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(
    String(phone || "")
  );
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName) {
      Alert.alert("Name Required", "Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setLoading(true);

     const user = await apiRequest("/api/auth/register", {
       method: "POST",
       body: JSON.stringify({
         phoneNumber: cleanPhone,
         name: cleanName,
       }),
     });

     if (!user.token) {
       throw new Error("Registration response mein JWT token missing hai.");
     }

     setAuthToken(user.token);

      Alert.alert(
        "Registration Successful",
        `Welcome to ChatFlow, ${user.name || cleanName}!`,
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace({
                pathname: "/home",
                params: {
                  userId: String(user.userId),
                  name: user.name || cleanName,
                  phone: user.phoneNumber || cleanPhone,
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.";

      Alert.alert("Registration Failed", message);
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
          disabled={loading}
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
          maxLength={100}
          autoCapitalize="words"
          editable={!loading}
        />

        <Text style={styles.label}>Mobile Number</Text>

        <View style={styles.phoneBox}>
          <Text style={styles.countryCode}>🇮🇳 +91</Text>

          <TextInput
            style={styles.phoneInput}
            placeholder="Enter mobile number"
            placeholderTextColor="#668180"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text.replace(/[^0-9]/g, ""));
            }}
            maxLength={10}
            editable={!loading}
          />
        </View>

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#062020" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                Create Account
              </Text>
              <Text style={styles.arrow}>→</Text>
            </>
          )}
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.muted}>
            Already have an account?{" "}
          </Text>

          <Pressable
            onPress={() => router.replace("/login")}
            disabled={loading}
          >
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
