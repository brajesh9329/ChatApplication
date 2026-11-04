import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { apiRequest } from "../constants/Api";

const formatChatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};

export default function HomeScreen() {
 const {
  userId,
  name,
  phone,
  profileImage,
  about,
} = useLocalSearchParams();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const currentUserId = Array.isArray(userId) ? userId[0] : userId;
  
  const displayName = Array.isArray(name) ? name[0] : name;
  const currentUserPhone = Array.isArray(phone) ? phone[0] : phone;

const currentProfileImage = Array.isArray(profileImage)
  ? profileImage[0]
  : profileImage;

const currentAbout = Array.isArray(about) ? about[0] : about;

  const loadChats = useCallback(async (isRefresh = false) => {
    if (!currentUserId) {
      setError("User ID nahi mila. Please dobara login karein.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await apiRequest(
        `/api/chats/user/${encodeURIComponent(currentUserId)}/list`
      );

      if (!Array.isArray(response)) {
        throw new Error("Server se chat list ka response valid nahi hai.");
      }

      setChats(
        response.map((item) => ({
          id: String(item.chatId),
          name:
  item.savedName ||
  item.participantName ||
  (item.type === "GROUP" ? "Group Chat" : "Unknown User"),
          message: item.lastMessage || "No messages yet",
          time: formatChatTime(item.lastMessageAt),
          participantId: item.participantId,
          type: item.type,
          avatar: item.type === "GROUP" ? "👥" : "👤",
        }))
      );
    } catch (err) {
      setError(err.message || "Chats load nahi ho paayi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats])
  );

  const filteredChats = chats.filter((chat) => {
    const query = search.trim().toLowerCase();

    return (
      chat.name.toLowerCase().includes(query) ||
      chat.message.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome{displayName ? `, ${displayName}` : " back"} 👋
          </Text>
          <Text style={styles.title}>Chats</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
  style={styles.headerButton}
  onPress={() =>
    router.push({
      pathname: "/profile",
      params: {
        userId: String(currentUserId || ""),
        name: String(displayName || ""),
        phone: String(currentUserPhone || ""),
        profileImage: String(currentProfileImage || ""),
        about: String(currentAbout || ""),
      },
    })
  }
>
  <Text style={styles.headerIcon}>👤</Text>
</Pressable>

          <Pressable
            style={styles.headerButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.headerIcon}>⚙</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#668180"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>
        <Text style={styles.count}>
          {chats.length} conversations
        </Text>
      </View>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#18D6D1" />
          <Text style={styles.stateText}>Loading chats...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadChats()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.chatList,
            filteredChats.length === 0 && styles.emptyChatList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadChats(true)}
              tintColor="#18D6D1"
              colors={["#18D6D1"]}
            />
          }
          keyboardShouldPersistTaps="handled"
        >
          {filteredChats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                {search.trim() ? "⌕" : "💬"}
              </Text>
              <Text style={styles.emptyTitle}>
                {search.trim() ? "No matching chats" : "No chats yet"}
              </Text>
              <Text style={styles.stateText}>
                {search.trim()
                  ? "Try another name or message."
                  : "Start a conversation to see it here."}
              </Text>
              {!search.trim() && (
                <Pressable
                  style={styles.retryButton}
                  onPress={() => router.push({
    pathname: "/search",
    params: { userId: String(currentUserId) },
  })}
                >
                  <Text style={styles.retryText}>Find People</Text>
                </Pressable>
              )}
            </View>
          ) : (
            filteredChats.map((chat) => (
              <Pressable
                key={chat.id}
                style={styles.chatCard}
                onPress={() =>
                  router.push({
                    pathname: "/chat",
                    params: {
                      id: chat.id,
                      chatId: chat.id,
                      userId: String(currentUserId),
                      participantId:
                        chat.participantId != null
                          ? String(chat.participantId)
                          : "",
                      name: chat.name,
                      phone: phone ? String(phone) : "",
                    },
                  })
                }
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{chat.avatar}</Text>
                  </View>
                </View>

                <View style={styles.chatInfo}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {chat.name}
                  </Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {chat.message}
                  </Text>
                </View>

                <View style={styles.chatMeta}>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={styles.activeNavIcon}>▣</Text>
          <Text style={styles.activeNavText}>Chats</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push({
    pathname: "/search",
    params: { userId: String(currentUserId) },
  })}
        >
          <Text style={styles.navIcon}>⌕</Text>
          <Text style={styles.navText}>Search</Text>
        </Pressable>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push({
    pathname: "/search",
    params: { userId: String(currentUserId) },
  })}
        >
          <Text style={styles.addIcon}>＋</Text>
        </Pressable>

        <Pressable
  style={styles.navItem}
  onPress={() =>
    router.push({
      pathname: "/contacts",
      params: {
        userId: String(currentUserId),
      },
    })
  }
>
  <Text style={styles.navIcon}>♧</Text>
  <Text style={styles.navText}>Contacts</Text>
</Pressable>

        <Pressable
  style={styles.navItem}
  onPress={() =>
    router.push({
      pathname: "/profile",
      params: {
        userId: String(currentUserId || ""),
        name: String(displayName || ""),
        phone: String(currentUserPhone || ""),
        profileImage: String(currentProfileImage || ""),
        about: String(currentAbout || ""),
      },
    })
  }
>
  <Text style={styles.navIcon}>♙</Text>
  <Text style={styles.navText}>Profile</Text>
</Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingTop: 55,
  },
  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#8BA7A5",
    fontSize: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  searchBox: {
    height: 49,
    marginHorizontal: 22,
    marginTop: 24,
    marginBottom: 25,
    borderRadius: 15,
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchIcon: {
    color: "#18D6D1",
    fontSize: 25,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
  },
  sectionHeader: {
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  count: {
    color: "#668180",
    fontSize: 10,
  },
  chatList: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  emptyChatList: {
    flexGrow: 1,
  },
  chatCard: {
    minHeight: 79,
    backgroundColor: "#0B2929",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#193F3F",
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  lastMessage: {
    color: "#829C9A",
    fontSize: 11,
    marginTop: 6,
  },
  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 6,
  },
  chatTime: {
    color: "#668180",
    fontSize: 9,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  stateText: {
    color: "#829C9A",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyIcon: {
    color: "#18D6D1",
    fontSize: 34,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
  bottomNav: {
    height: 76,
    backgroundColor: "#0A2929",
    borderTopWidth: 1,
    borderTopColor: "#173B3B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
    paddingBottom: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    color: "#718B8A",
    fontSize: 22,
  },
  activeNavIcon: {
    color: "#18D6D1",
    fontSize: 22,
  },
  navText: {
    color: "#718B8A",
    fontSize: 9,
    marginTop: 4,
  },
  activeNavText: {
    color: "#18D6D1",
    fontSize: 9,
    marginTop: 4,
    fontWeight: "700",
  },
  addButton: {
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    marginTop: -24,
    elevation: 5,
  },
  addIcon: {
    color: "#062020",
    fontSize: 30,
    lineHeight: 34,
  },
});
