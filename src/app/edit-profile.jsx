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
} from "react-native";
import { router } from "expo-router";

export default function EditProfileScreen() {
  const [name, setName] = useState("ChatFlow User");
  const [about, setAbout] = useState("Hey there! I'm using ChatFlow.");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <Pressable style={styles.avatarBox}>
          <Text style={styles.avatar}>👤</Text>
          <View style={styles.cameraBadge}>
            <Text style={styles.camera}>＋</Text>
          </View>
        </Pressable>

        <Text style={styles.changePhoto}>Change Profile Photo</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#668180"
          maxLength={60}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <View style={[styles.input, styles.disabledInput]}>
          <Text style={styles.disabledText}>+91 XXXXX XXXXX</Text>
          <Text style={styles.verified}>Verified</Text>
        </View>

        <Text style={styles.label}>About</Text>
        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={about}
          onChangeText={setAbout}
          placeholder="Write something about yourself"
          placeholderTextColor="#668180"
          multiline
          maxLength={150}
          textAlignVertical="top"
        />

        <Text style={styles.characterCount}>{about.length}/150</Text>

        <Pressable
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
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
    width: 92,
    height: 92,
    borderRadius: 31,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "relative",
    marginTop: 8,
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