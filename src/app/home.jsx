import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const chats = [
  {
    id: "1",
    name: "Rahul Sharma",
    message: "Hey bro! 👋",
    time: "10:42 PM",
    unread: 2,
    avatar: "👨",
    online: true,
  },
  {
    id: "2",
    name: "Priya Verma",
    message: "See you tomorrow!",
    time: "9:30 PM",
    unread: 0,
    avatar: "👩",
    online: true,
  },
  {
    id: "3",
    name: "Aman Singh",
    message: "Photo bhej dena",
    time: "8:15 PM",
    unread: 1,
    avatar: "🧑",
    online: false,
  },
  {
    id: "4",
    name: "College Friends",
    message: "You: Okay, see you!",
    time: "Yesterday",
    unread: 0,
    avatar: "👥",
    online: false,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.title}>Chats</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.push("/profile")}
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
          onFocus={() => router.push("/search")}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>
        <Text style={styles.count}>{chats.length} conversations</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatList}
      >
        {chats.map((chat) => (
          <Pressable
            key={chat.id}
            style={styles.chatCard}
            onPress={() => router.push(`/chat?id=${chat.id}`)}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{chat.avatar}</Text>
              </View>

              {chat.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {chat.message}
              </Text>
            </View>

            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{chat.time}</Text>

              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={styles.activeNavIcon}>▣</Text>
          <Text style={styles.activeNavText}>Chats</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.navIcon}>⌕</Text>
          <Text style={styles.navText}>Search</Text>
        </Pressable>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.addIcon}>＋</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/contacts")}
        >
          <Text style={styles.navIcon}>♧</Text>
          <Text style={styles.navText}>Contacts</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile")}
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
  onlineDot: {
    position: "absolute",
    right: -2,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#18D6D1",
    borderWidth: 2,
    borderColor: "#0B2929",
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
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
  },
  unreadText: {
    color: "#062020",
    fontSize: 10,
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