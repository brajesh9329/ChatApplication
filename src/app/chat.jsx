
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Client } from "@stomp/stompjs";
import {
  apiRequest,
  API_BASE_URL,
  getAuthToken,
} from "../constants/Api";

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getParam = (value) => {
  if (Array.isArray(value)) {
    return String(value[0] ?? "");
  }

  return String(value ?? "");
};

const getMessageSenderId = (message) => {
  return message.senderId ?? message.sender?.id ?? null;
};

export default function ChatScreen() {
  const params = useLocalSearchParams();

  const chatId = getParam(params.chatId || params.id);
  const userId = getParam(params.userId);
  const chatName = getParam(params.name) || "Chat";

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  const clientRef = useRef(null);
  const listRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const addMessage = useCallback(
    (message) => {
      if (message?.id == null) return;

      const key = String(message.id);

      if (messageIdsRef.current.has(key)) {
        return;
      }

      messageIdsRef.current.add(key);

      const newMessage = {
        id: key,
        text: message.content ?? "",
        time: formatTime(message.createdAt),
        mine: String(getMessageSenderId(message)) === userId,
      };

      setMessages((previous) => [...previous, newMessage]);
    },
    [userId]
  );

  // Load chat message history
  const loadMessages = useCallback(async () => {
    if (!chatId || !userId) {
      setError("Chat ID ya logged-in user ID nahi mila.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        `/api/messages/chat/${encodeURIComponent(chatId)}?page=0&size=100`
      );

      const content = Array.isArray(response)
        ? response
        : response?.content;

      if (!Array.isArray(content)) {
        throw new Error(
          "Message history ka response valid nahi hai."
        );
      }

      const sorted = [...content].sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;

        if (timeA !== timeB) {
          return timeA - timeB;
        }

        return Number(a.id) - Number(b.id);
      });

      messageIdsRef.current = new Set(
        sorted
          .filter((message) => message?.id != null)
          .map((message) => String(message.id))
      );

      setMessages(
        sorted
          .filter((message) => message?.id != null)
          .map((message) => ({
            id: String(message.id),
            text: message.content ?? "",
            time: formatTime(message.createdAt),
            mine:
              String(getMessageSenderId(message)) === userId,
          }))
      );

      console.log("MESSAGE HISTORY LOADED:", sorted.length);
    } catch (err) {
      console.log("LOAD MESSAGES ERROR:", err?.message);

      setError(
        err?.message || "Messages load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  }, [chatId, userId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Background refresh as a fallback
  const refreshMessages = useCallback(async () => {
    if (!chatId || !userId) return;

    try {
      const response = await apiRequest(
        `/api/messages/chat/${encodeURIComponent(chatId)}?page=0&size=100`
      );

      const content = Array.isArray(response)
        ? response
        : response?.content;

      if (!Array.isArray(content)) return;

      const sorted = [...content].sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;

        return timeA - timeB;
      });

      sorted.forEach((message) => {
        addMessage(message);
      });
    } catch (err) {
      console.log(
        "BACKGROUND MESSAGE REFRESH ERROR:",
        err?.message
      );
    }
  }, [chatId, userId, addMessage]);

  useEffect(() => {
    if (!chatId || !userId) return;

    const intervalId = setInterval(() => {
      refreshMessages();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [chatId, userId, refreshMessages]);

  // WebSocket connection with JWT authentication
  useEffect(() => {
    if (!chatId || !userId) return;

    const wsUrl =
      API_BASE_URL.replace(/\/$/, "")
        .replace(/^https:/, "wss:")
        .replace(/^http:/, "ws:") + "/ws";

    console.log("WEBSOCKET URL:", wsUrl);

    let active = true;

    const client = new Client({
      webSocketFactory: () => new WebSocket(wsUrl),

      // Send JWT in STOMP CONNECT headers
      beforeConnect: () => {
        const token = getAuthToken();

        if (!token) {
          console.log(
            "WEBSOCKET ERROR: JWT token missing"
          );

          throw new Error(
            "JWT token missing. Please login again."
          );
        }

        client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };

        console.log("STOMP JWT HEADER CONFIGURED");
      },

      reconnectDelay: 5000,
      connectionTimeout: 10000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      debug: (message) => {
        // Do not expose JWT from STOMP CONNECT debug logs.
        if (message.startsWith(">>> CONNECT")) {
          console.log(
            "STOMP DEBUG: Sending CONNECT frame"
          );
          return;
        }

        console.log("STOMP DEBUG:", message);
      },

      onConnect: (frame) => {
        if (!active) return;

        console.log(
          "STOMP CONNECTED:",
          frame?.headers
        );

        setConnected(true);
        setConnectionError("");

        client.subscribe(
          `/topic/chat/${chatId}`,
          (messageFrame) => {
            try {
              const receivedMessage = JSON.parse(
                messageFrame.body
              );

              console.log(
                "WEBSOCKET MESSAGE RECEIVED:",
                receivedMessage?.id
              );

              addMessage(receivedMessage);
            } catch (err) {
              console.warn(
                "WEBSOCKET MESSAGE PARSE ERROR:",
                err?.message
              );
            }
          }
        );
      },

      onWebSocketError: (event) => {
        if (!active) return;

        console.warn("WEBSOCKET ERROR EVENT:", {
          type: event?.type,
          message: event?.message,
          nativeEvent: event?.nativeEvent,
        });

        setConnected(false);
        setConnectionError(
          "WebSocket connection failed."
        );
      },

      onWebSocketClose: (event) => {
        if (!active) return;

        console.log("WEBSOCKET CLOSED:", {
          code: event?.code,
          reason: event?.reason,
          wasClean: event?.wasClean,
        });

        setConnected(false);

        if (event?.code !== 1000) {
          setConnectionError(
            `WebSocket disconnected (${event?.code ?? "unknown"}).`
          );
        }
      },

      onStompError: (frame) => {
        if (!active) return;

        console.warn("STOMP ERROR:", {
          message: frame?.headers?.message,
          body: frame?.body,
        });

        setConnected(false);

        setConnectionError(
          frame?.headers?.message ||
            "STOMP connection failed."
        );
      },

      onDisconnect: () => {
        if (!active) return;

        console.log("STOMP DISCONNECTED");
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      active = false;
      clientRef.current = null;
      client.deactivate();
    };
  }, [chatId, userId, addMessage]);

  // Send message using REST API
  const sendMessage = async () => {
    const content = messageText.trim();

    if (!content || sending) return;

    if (!chatId || !userId) {
      Alert.alert(
        "Error",
        "Chat ID ya logged-in user ID missing hai."
      );
      return;
    }

    setSending(true);

    try {
      const savedMessage = await apiRequest(
        `/api/messages/chat/${encodeURIComponent(chatId)}`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
            messageType: "TEXT",
          }),
        }
      );

      console.log(
        "MESSAGE SENT:",
        savedMessage?.id
      );

      addMessage(savedMessage);
      setMessageText("");
    } catch (err) {
      console.log(
        "SEND MESSAGE ERROR:",
        err?.message
      );

      Alert.alert(
        "Message failed",
        err?.message || "Message send nahi hua."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 10 : 0
      }
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

          <View
            style={[
              styles.online,
              !connected && styles.offline,
            ]}
          />
        </View>

        <View style={styles.userInfo}>
          <Text
            style={styles.userName}
            numberOfLines={1}
          >
            {chatName}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                !connected && styles.offline,
              ]}
            />

            <Text style={styles.status}>
              {connected
                ? "Connected"
                : connectionError
                  ? "Disconnected"
                  : "Connecting..."}
            </Text>
          </View>
        </View>

        <Pressable style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⌕</Text>
        </Pressable>

        <Pressable style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⋮</Text>
        </Pressable>
      </View>

      {connectionError ? (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionBannerText}>
            {connectionError} Messages can still be sent
            through the REST API.
          </Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color="#18D6D1"
          />

          <Text style={styles.stateText}>
            Loading messages...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadMessages}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({
              animated: true,
            });
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.stateText}>
                No messages yet. Say hello!
              </Text>
            </View>
          }
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
                  item.mine
                    ? styles.myBubble
                    : styles.otherBubble,
                ]}
              >
                <Text style={styles.messageText}>
                  {item.text}
                </Text>

                <View style={styles.timeRow}>
                  <Text style={styles.messageTime}>
                    {item.time}
                  </Text>

                  {item.mine && (
                    <Text style={styles.readIcon}>
                      ✓
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.inputArea}>
        <Pressable
          style={styles.attachButton}
          onPress={() =>
            Alert.alert(
              "Attachments",
              "Attachment support will be added next."
            )
          }
        >
          <Text style={styles.attach}>＋</Text>
        </Pressable>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#668180"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={4000}
          />

          <Pressable
            style={styles.emojiButton}
            onPress={() =>
              setMessageText((text) => text + " 😊")
            }
          >
            <Text style={styles.emoji}>☺</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.cameraButton}
          onPress={() =>
            Alert.alert(
              "Camera",
              "Camera support will be added next."
            )
          }
        >
          <Text style={styles.camera}>◎</Text>
        </Pressable>

        <Pressable
          style={[
            styles.sendButton,
            (!messageText.trim() || sending) &&
              styles.disabledSend,
          ]}
          onPress={sendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color="#062020"
            />
          ) : (
            <Text style={styles.send}>➤</Text>
          )}
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
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
  offline: {
    backgroundColor: "#718B8A",
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
    flexGrow: 1,
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
    minHeight: 46,
    backgroundColor: "#102B2B",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#234747",
    flexDirection: "row",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  disabledSend: {
    opacity: 0.55,
  },
  send: {
    color: "#062020",
    fontSize: 19,
    marginLeft: 2,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  stateText: {
    color: "#829C9A",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#18D6D1",
  },
  retryText: {
    color: "#062020",
    fontSize: 12,
    fontWeight: "800",
  },
  connectionBanner: {
    backgroundColor: "#51352B",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  connectionBannerText: {
    color: "#FFD6B5",
    fontSize: 11,
    textAlign: "center",
  },
});
