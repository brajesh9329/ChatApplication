import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function EditProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/200?img=12" }}
          style={styles.photo}
        />

        <Pressable style={styles.camera}>
          <Text>✎</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Full Name</Text>

      <TextInput
        style={styles.input}
        value="Rahul Sharma"
        placeholderTextColor="#668180"
      />

      <Text style={styles.label}>Mobile Number</Text>

      <TextInput
        style={[styles.input, styles.disabled]}
        value="+91 9876543210"
        editable={false}
      />

      <Text style={styles.label}>About</Text>

      <TextInput
        style={[styles.input, styles.about]}
        value="Available for a chat 😊"
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
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
    marginBottom: 35,
  },

  back: {
    color: "#FFFFFF",
    fontSize: 38,
    marginRight: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  photoContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 35,
  },

  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#18D6D1",
  },

  camera: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#D3E0DF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#102B2B",
    borderWidth: 1,
    borderColor: "#315454",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 14,
  },

  disabled: {
    color: "#668180",
  },

  about: {
    height: 90,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  button: {
    height: 56,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
  },

  buttonText: {
    color: "#062020",
    fontWeight: "800",
    fontSize: 15,
  },
});