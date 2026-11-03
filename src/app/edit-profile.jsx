import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import * as ImagePicker from "expo-image-picker";

import { File } from "expo-file-system";

import { API_BASE_URL, apiRequest } from "../constants/Api";


export default function EditProfileScreen() {

  const params = useLocalSearchParams();

  // Route parameters
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const phone = Array.isArray(params.phone)
    ? params.phone[0]
    : params.phone;

  const email = Array.isArray(params.email)
    ? params.email[0]
    : params.email;

  const initialName = Array.isArray(params.name)
    ? params.name[0]
    : params.name;

  const initialAbout = Array.isArray(params.about)
    ? params.about[0]
    : params.about;

  const initialProfileImage = Array.isArray(params.profileImage)
    ? params.profileImage[0]
    : params.profileImage;


  // States
  const [name, setName] = useState(initialName || "");

  const [about, setAbout] = useState(initialAbout || "");

  const [profileImage, setProfileImage] = useState(
    initialProfileImage || ""
  );

  const [newImage, setNewImage] = useState(null);

  const [saving, setSaving] = useState(false);


  // Convert relative image path into complete URL
  const getImageUrl = (path) => {

    if (!path) return null;

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };


  // Open gallery and select image
  const pickImage = async () => {

    try {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          "Permission Required",
          "Please allow gallery access to select a profile photo."
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

        const selectedImage = result.assets[0];

        // Local preview
        setNewImage(selectedImage);
      }

    } catch (error) {

      console.log("IMAGE PICK ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to open gallery."
      );
    }
  };


  // Upload selected profile image
  const uploadProfileImage = async () => {

    if (!newImage) {
      return profileImage;
    }

    try {

      const imageFile = new File(newImage.uri);

      const formData = new FormData();

      formData.append("file", imageFile);

      console.log("Uploading profile image...");

      const response = await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/profile-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("IMAGE UPLOAD RESPONSE:", response);

      // Backend UserResponseDTO returns profileImage
      const savedPath = response?.profileImage;

      if (!savedPath) {

        throw new Error(
          "Image uploaded, but profileImage path was not returned by server."
        );
      }

      console.log("SAVED PROFILE IMAGE PATH:", savedPath);

      return savedPath;

    } catch (error) {

      console.log("IMAGE UPLOAD ERROR:", error);

      throw error;
    }
  };


  // Save profile details
  const handleSave = async () => {

    if (!userId) {

      Alert.alert(
        "Error",
        "User ID not found. Please login again."
      );

      return;
    }

    if (!name.trim()) {

      Alert.alert(
        "Validation",
        "Please enter your name."
      );

      return;
    }

    if (saving) return;

    try {

      setSaving(true);

      let savedImagePath = profileImage;


      // STEP 1: Upload new image if selected
      if (newImage) {

        savedImagePath = await uploadProfileImage();

      }


      // STEP 2: Update name, email, about and profile image
      const updateResponse = await apiRequest(
        `/api/users/${encodeURIComponent(userId)}`,
        {
          method: "PUT",

          body: JSON.stringify({

            name: name.trim(),

            email: email || null,

            about: about.trim(),

            profileImage: savedImagePath || null,

          }),
        }
      );

      console.log("PROFILE UPDATE RESPONSE:", updateResponse);


      // STEP 3: Get updated values
      const updatedName =
        updateResponse?.name || name.trim();

      const updatedAbout =
        updateResponse?.about ?? about.trim();

      const updatedImage =
        updateResponse?.profileImage || savedImagePath || "";


      // STEP 4: Update local state
      setProfileImage(updatedImage);

      setNewImage(null);


      // STEP 5: Navigate to Profile screen
      Alert.alert(
        "Success",
        "Profile updated successfully!",
        [
          {
            text: "OK",

            onPress: () => {

              router.replace({
                pathname: "/profile",

                params: {

                  userId: String(userId),

                  name: updatedName,

                  phone: String(phone || ""),

                  email: String(updateResponse?.email || email || ""),

                  about: updatedAbout,

                  profileImage: updatedImage,

                },
              });

            },
          },
        ]
      );

    } catch (error) {

      console.log("PROFILE UPDATE ERROR:", error);

      Alert.alert(
        "Update Failed",
        error.message || "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }
  };


  // Preview selected image or existing profile image
  const previewImage = newImage?.uri
    ? newImage.uri
    : getImageUrl(profileImage);


  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={saving}
          >

            <Text style={styles.back}>‹</Text>

          </Pressable>

          <Text style={styles.title}>
            Edit Profile
          </Text>

        </View>


        {/* Profile Image */}

        <Pressable
          style={styles.avatarBox}
          onPress={pickImage}
          disabled={saving}
        >

          {previewImage ? (

            <Image
              source={{ uri: previewImage }}
              style={styles.profileImage}
              onError={(error) => {
                console.log(
                  "PROFILE IMAGE PREVIEW ERROR:",
                  error.nativeEvent
                );
              }}
            />

          ) : (

            <Text style={styles.avatar}>
              👤
            </Text>

          )}

          <View style={styles.cameraBadge}>

            <Text style={styles.camera}>
              +
            </Text>

          </View>

        </Pressable>


        <Text style={styles.changePhoto}>
          Change Profile Photo
        </Text>


        {/* Full Name */}

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#668180"
          maxLength={60}
          editable={!saving}
        />


        {/* Mobile Number */}

        <Text style={styles.label}>
          Mobile Number
        </Text>

        <View style={[styles.input, styles.disabledInput]}>

          <Text style={styles.disabledText}>
            {phone || "Phone number not available"}
          </Text>

          <Text style={styles.verified}>
            Verified
          </Text>

        </View>


        {/* Email */}

        <Text style={styles.label}>
          Email
        </Text>

        <View style={[styles.input, styles.disabledInput]}>

          <Text style={styles.disabledText}>
            {email || "Email not available"}
          </Text>

        </View>


        {/* About */}

        <Text style={styles.label}>
          About
        </Text>

        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={about}
          onChangeText={setAbout}
          placeholder="Write something about yourself"
          placeholderTextColor="#668180"
          multiline
          maxLength={150}
          textAlignVertical="top"
          editable={!saving}
        />


        <Text style={styles.characterCount}>
          {about.length}/150
        </Text>


        {/* Save Button */}

        <Pressable
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
        >

          {saving ? (

            <View style={styles.loadingContainer}>

              <ActivityIndicator color="#062020" />

              <Text style={styles.saveText}>
                {" "}Saving...
              </Text>

            </View>

          ) : (

            <Text style={styles.saveText}>
              ✓ Save Changes
            </Text>

          )}

        </Pressable>


        {/* Cancel Button */}

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >

          <Text style={styles.cancelText}>
            Cancel
          </Text>

        </Pressable>

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
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0B2929",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "relative",
    marginTop: 8,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 32,
  },

  avatar: {
    fontSize: 43,
  },

  cameraBadge: {
    position: "absolute",
    right: -3,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },

  camera: {
    color: "#062020",
    fontSize: 21,
    fontWeight: "700",
  },

  changePhoto: {
    color: "#18D6D1",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 25,
  },

  label: {
    color: "#D7E5E3",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 9,
    marginTop: 17,
  },

  input: {
    minHeight: 53,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#234747",
    backgroundColor: "#0B2929",
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 13,
    justifyContent: "center",
  },

  disabledInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  disabledText: {
    color: "#829C9A",
    fontSize: 13,
  },

  verified: {
    color: "#18D6D1",
    fontSize: 10,
    fontWeight: "700",
  },

  aboutInput: {
    height: 100,
    paddingTop: 14,
  },

  characterCount: {
    color: "#668180",
    fontSize: 10,
    textAlign: "right",
    marginTop: 7,
  },

  saveButton: {
    height: 55,
    borderRadius: 16,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#062020",
    fontSize: 14,
    fontWeight: "800",
  },

  cancelButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  cancelText: {
    color: "#8BA7A5",
    fontSize: 13,
    fontWeight: "600",
  },

});