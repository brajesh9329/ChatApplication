import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const messages = [
  { id: "1", text: "Hey bro! 👋", time: "10:38 PM", mine: false },
  { id: "2", text: "Hey! How are you?", time: "10:39 PM", mine: true },
  { id: "3", text: "I'm good. What about you?", time: "10:40 PM", mine: false },
  { id: "4", text: "I'm doing great 😄", time: "10:41 PM", mine: true },
  { id: "5", text: "Are you free tomorrow?", time: "10:42 PM", mine: false },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

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
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>👤</Text>
          <View style={styles.online} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Rahul Sharma</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.status}>Online</Text>
          </View>
        </View>

        <Pressable style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⌕</Text>
        </Pressable>

        <Pressable style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⋮</Text>
        </Pressable>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.mine && styles.myMessageContainer,
            ]}
          >
            <View
              style={[
                styles.bubble,
                item.mine ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>

              <View style={styles.timeRow}>
                <Text style={styles.messageTime}>{item.time}</Text>
                {item.mine && (
                  <Text style={styles.readIcon}>✓✓</Text>
                )}
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <Pressable style={styles.attachButton}>
          <Text style={styles.attach}>＋</Text>
        </Pressable>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#668180"
          />
          <Pressable style={styles.emojiButton}>
            <Text style={styles.emoji}>☺</Text>
          </Pressable>
        </View>

        <Pressable style={styles.cameraButton}>
          <Text style={styles.camera}>◎</Text>
        </Pressable>

        <Pressable style={styles.sendButton}>
          <Text style={styles.send}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },
  header: {
    height: 92,
    paddingTop: 38,
    paddingHorizontal: 10,
    backgroundColor: "#0A2929",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#173B3B",
  },
  backButton: {
    width: 38,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  backIcon: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 38,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#234545",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: {
    fontSize: 21,
  },
  online: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#18D6D1",
    right: -1,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#0A2929",
  },
  userInfo: {
    flex: 1,
    marginLeft: 11,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#18D6D1",
    marginRight: 5,
  },
  status: {
    color: "#18D6D1",
    fontSize: 11,
  },
  headerIcon: {
    width: 39,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    color: "#D7FFFF",
    fontSize: 25,
    fontWeight: "600",
  },
  messages: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 18,
  },
  messageContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 13,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingTop: 11,
    paddingBottom: 8,
    borderRadius: 18,
  },
  otherBubble: {
    backgroundColor: "#172F2F",
    borderBottomLeftRadius: 5,
  },
  myBubble: {
    backgroundColor: "#18BDB9",
    borderBottomRightRadius: 5,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  messageTime: {
    color: "#A7C9C7",
    fontSize: 9,
  },
  readIcon: {
    color: "#B9F4F1",
    fontSize: 10,
    marginLeft: 5,
    fontWeight: "700",
  },
  inputArea: {
    minHeight: 70,
    backgroundColor: "#0A2929",
    borderTopWidth: 1,
    borderTopColor: "#173B3B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  attachButton: {
    width: 35,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  attach: {
    color: "#18D6D1",
    fontSize: 28,
  },
  inputWrapper: {
    flex: 1,
    height: 46,
    backgroundColor: "#102B2B",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#234747",
    flexDirection: "row",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 14,
    color: "#FFFFFF",
    fontSize: 13,
  },
  emojiButton: {
    width: 32,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    color: "#799493",
    fontSize: 21,
  },
  cameraButton: {
    width: 34,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    color: "#A0B9B7",
    fontSize: 24,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  send: {
    color: "#062020",
    fontSize: 19,
    marginLeft: 2,
  },
});