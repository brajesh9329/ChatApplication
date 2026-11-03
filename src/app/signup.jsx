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
  Image,
} from "react-native";

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { router, useLocalSearchParams } from "expo-router";

import { apiRequest, setAuthToken } from "../constants/Api";

export default function SignupScreen() {
  const { phone } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(String(phone || ""));
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Open gallery and select profile photo
  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow gallery access to select your profile photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert(
        "Gallery Error",
        error?.message || "Gallery open nahi ho paayi."
      );
    }
  };

  // Register User
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

      // STEP 1: Register user
      const user = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          name: cleanName,
        }),
      });

      console.log("REGISTER RESPONSE:", user);

      if (!user.token) {
        throw new Error(
          "Registration response mein JWT token missing hai."
        );
      }

      // STEP 2: Save JWT token
      setAuthToken(user.token);

      // Store uploaded image path
      let savedProfileImage = "";

      // STEP 3: Upload image if user selected one
      if (profileImage?.uri) {
        try {
          console.log("Uploading profile image...");

          const formData = new FormData();

          const imageFile = new File(profileImage.uri);

          formData.append("file", imageFile);

          const uploadResponse = await apiRequest(
            `/api/users/${user.userId}/profile-image`,
            {
              method: "POST",
              body: formData,
            }
          );

          console.log("IMAGE UPLOAD RESPONSE:", uploadResponse);

          // Get image path from backend response
          savedProfileImage =
            uploadResponse.profileImage ||
            uploadResponse.path ||
            uploadResponse.url ||
            "";

          console.log(
            "SAVED PROFILE IMAGE PATH:",
            savedProfileImage
          );

        } catch (uploadError) {
          console.error(
            "PROFILE IMAGE UPLOAD FAILED:",
            uploadError
          );

          Alert.alert(
            "Profile Photo Upload Failed",
            `Your account was created, but the photo could not be uploaded.\n\n${uploadError.message}`
          );
        }
      }

      // STEP 4: Navigate to Home
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

                  // FIXED: Use savedProfileImage
                  profileImage: savedProfileImage,

                  about: "",
                },
              });
            },
          },
        ]
      );

    } catch (error) {
      console.error("REGISTRATION ERROR:", error);

      Alert.alert(
        "Registration Failed",
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
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

        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        {/* Heading */}
        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join ChatFlow and start a conversation.
        </Text>

        {/* Profile Photo Picker */}
        <Pressable
          style={styles.avatar}
          onPress={pickProfileImage}
          disabled={loading}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              👤
            </Text>
          )}

          <View style={styles.cameraBadge}>
            <Text style={styles.camera}>＋</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={pickProfileImage}
          disabled={loading}
        >
          <Text style={styles.photoHint}>
            {profileImage
              ? "Change Profile Photo"
              : "Choose Profile Photo"}
          </Text>
        </Pressable>

        {/* Full Name */}
        <Text style={styles.label}>
          Full Name
        </Text>

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

        {/* Mobile Number */}
        <Text style={styles.label}>
          Mobile Number
        </Text>

        <View style={styles.phoneBox}>
          <Text style={styles.countryCode}>
            🇮🇳 +91
          </Text>

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

        {/* Create Account Button */}
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

              <Text style={styles.arrow}>
                →
              </Text>
            </>
          )}
        </Pressable>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.muted}>
            Already have an account?{" "}
          </Text>

          <Pressable
            onPress={() => router.replace("/login")}
            disabled={loading}
          >
            <Text style={styles.link}>
              Login
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
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
    marginTop: 28,
    marginBottom: 10,
    position: "relative",
    overflow: "visible",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 44,
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

  photoHint: {
    color: "#18D6D1",
    fontSize: 12,
    marginBottom: 12,
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