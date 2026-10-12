import { useState } from "react";
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

export default function SearchScreen() {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Find Someone</Text>
      </View>

      <Text style={styles.subtitle}>
        Search by mobile number to start a conversation.
      </Text>

      <View style={styles.searchBox}>
        <Text style={styles.countryCode}>🇮🇳 +91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#668180"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
            setSearched(false);
          }}
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => setSearched(true)}
      >
        <Text style={styles.buttonText}>Search User</Text>
        <Text style={styles.arrow}>⌕</Text>
      </Pressable>

      {searched && (
        <View style={styles.resultCard}>
          {phone.length === 10 ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👨</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>Rahul Sharma</Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.demoNote}>
                  Demo search result
                </Text>
              </View>

              <Pressable
                style={styles.chatButton}
                onPress={() => router.push("/chat?id=1")}
              >
                <Text style={styles.chatButtonText}>Chat</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.errorText}>
              Enter a valid 10-digit mobile number.
            </Text>
          )}
        </View>
      )}

      <View style={styles.tipBox}>
        <Text style={styles.tipIcon}>✦</Text>
        <Text style={styles.tipText}>
          You can find people who are using ChatFlow by their registered
          mobile number.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingHorizontal: 22,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8BA7A5",
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 26,
  },
  searchBox: {
    height: 56,
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
    height: "100%",
    color: "#FFFFFF",
    fontSize: 14,
  },
  button: {
    height: 55,
    borderRadius: 16,
    backgroundColor: "#18D6D1",
    marginTop: 17,
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
    fontSize: 25,
    marginLeft: 9,
  },
  resultCard: {
    minHeight: 86,
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    borderRadius: 18,
    marginTop: 25,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  phone: {
    color: "#8BA7A5",
    fontSize: 11,
    marginTop: 4,
  },
  demoNote: {
    color: "#18D6D1",
    fontSize: 9,
    marginTop: 4,
  },
  chatButton: {
    backgroundColor: "#18D6D1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chatButtonText: {
    color: "#062020",
    fontSize: 12,
    fontWeight: "800",
  },
  errorText: {
    color: "#FF9999",
    fontSize: 12,
    flex: 1,
  },
  tipBox: {
    backgroundColor: "#0B2929",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#193F3F",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 25,
  },
  tipIcon: {
    color: "#18D6D1",
    fontSize: 20,
    marginRight: 11,
  },
  tipText: {
    flex: 1,
    color: "#8BA7A5",
    fontSize: 12,
    lineHeight: 19,
  },
});