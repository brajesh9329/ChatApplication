import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest } from "../constants/Api";

export default function SearchScreen() {
  const params = useLocalSearchParams();

  const loggedInUserId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");

  const searchUser = async () => {
    const number = phone.trim();

    setSearched(true);
    setFoundUser(null);
    setError("");

    if (!/^\d{10}$/.test(number)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const user = await apiRequest(
        `/api/users/phone/${encodeURIComponent(number)}`
      );

      if (!user?.id) {
        throw new Error("User ID response mein nahi mila.");
      }

      if (
        loggedInUserId &&
        String(user.id) === String(loggedInUserId)
      ) {
        setError("You cannot start a chat with your own number.");
        return;
      }

      setFoundUser(user);
    } catch (err) {
      const message = err?.message || "";

      setError(
        /not found|user not found|404/i.test(message)
          ? "This number is not registered on ChatFlow."
          : message || "User search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!loggedInUserId) {
      setError(
        "Logged-in user ID missing hai. Please dobara login karein."
      );
      return;
    }

    if (!foundUser?.id) {
      setError("Please search for a registered user first.");
      return;
    }

    if (String(foundUser.id) === String(loggedInUserId)) {
      setError("You cannot start a chat with your own number.");
      return;
    }

    setStartingChat(true);
    setError("");

    try {
      const chat = await apiRequest(
        `/api/chats/direct?userId1=${encodeURIComponent(String(loggedInUserId))}` +
          `&userId2=${encodeURIComponent(String(foundUser.id))}`,
        {
          method: "POST",
        }
      );

      const chatId = chat?.id ?? chat?.chatId;

      if (chatId == null) {
        throw new Error(
          "Chat ID response mein nahi mili. Direct chat API response check karo."
        );
      }

      router.push({
        pathname: "/chat",
        params: {
          chatId: String(chatId),
          id: String(chatId),
          userId: String(loggedInUserId),
          participantId: String(foundUser.id),
          name: foundUser.name ?? "Chat",
        },
      });
    } catch (err) {
      setError(err?.message || "Unable to start chat.");
    } finally {
      setStartingChat(false);
    }
  };

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
            setPhone(value.replace(/\D/g, ""));
            setSearched(false);
            setFoundUser(null);
            setError("");
          }}
          onSubmitEditing={searchUser}
          returnKeyType="search"
        />
      </View>

      <Pressable
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={searchUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#062020" />
        ) : (
          <>
            <Text style={styles.buttonText}>Search User</Text>
            <Text style={styles.arrow}>⌕</Text>
          </>
        )}
      </Pressable>

      {searched && (
        <View style={styles.resultCard}>
          {loading ? (
            <ActivityIndicator color="#18D6D1" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : foundUser ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {foundUser.profileImage ? "🖼️" : "👤"}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {foundUser.name ?? "ChatFlow User"}
                </Text>

                <Text style={styles.phone}>
                  {foundUser.phoneNumber ?? phone}
                </Text>

                {foundUser.about ? (
                  <Text style={styles.about} numberOfLines={2}>
                    {foundUser.about}
                  </Text>
                ) : null}
              </View>

              <Pressable
                style={[
                  styles.chatButton,
                  startingChat && styles.disabledButton,
                ]}
                onPress={startChat}
                disabled={startingChat}
              >
                {startingChat ? (
                  <ActivityIndicator color="#062020" />
                ) : (
                  <Text style={styles.chatButtonText}>Chat</Text>
                )}
              </Pressable>
            </>
          ) : null}
        </View>
      )}

      <View style={styles.tipBox}>
        <Text style={styles.tipIcon}>✦</Text>
        <Text style={styles.tipText}>
          You can find people who are using ChatFlow by their
          registered mobile number.
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
  disabledButton: {
    opacity: 0.65,
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
    marginRight: 8,
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
  about: {
    color: "#8BA7A5",
    fontSize: 10,
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
