import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";

const chats = [
  {
    id: "1",
    name: "Rahul Sharma",
    message: "Hey bro, what's up?",
    time: "10:42 PM",
    unread: 2,
    online: true,
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    name: "Aman Verma",
    message: "Photo sent",
    time: "9:31 PM",
    unread: 1,
    online: true,
    image: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "3",
    name: "Priya Singh",
    message: "Okay 👍",
    time: "8:45 PM",
    unread: 0,
    online: false,
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "4",
    name: "Rohan Patel",
    message: "See you tomorrow",
    time: "7:20 PM",
    unread: 0,
    online: false,
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "5",
    name: "Neha Gupta",
    message: "Thanks 😊",
    time: "6:15 PM",
    unread: 0,
    online: true,
    image: "https://i.pravatar.cc/150?img=44",
  },
];

export default function HomeScreen() {
  const renderChat = ({ item }: any) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => router.push(`/chat?id=${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />

        {item.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.message} numberOfLines={1}>
            {item.message}
          </Text>

          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Welcome back 👋</Text>
          <Text style={styles.title}>Chats</Text>
        </View>

        {/* HEADER ACTIONS */}
        <View style={styles.headerActions}>

          {/* SETTINGS */}
          <Pressable
            style={styles.headerButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>

          {/* PROFILE */}
          <Pressable
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </Pressable>

        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#668180"
        />

        <Pressable>
          <Text style={styles.filterIcon}>☷</Text>
        </Pressable>
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatList}
      />

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>

        {/* CHATS */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Text style={[styles.navIcon, styles.activeIcon]}>
            ◉
          </Text>

          <Text style={styles.activeText}>
            Chats
          </Text>
        </Pressable>

        {/* SEARCH */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.navIcon}>
            ⌕
          </Text>

          <Text style={styles.navText}>
            Search
          </Text>
        </Pressable>

        {/* NEW CHAT */}
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.addText}>
            +
          </Text>
        </Pressable>

        {/* CONTACTS */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/contacts")}
        >
          <Text style={styles.navIcon}>
            ♧
          </Text>

          <Text style={styles.navText}>
            Contacts
          </Text>
        </Pressable>

        {/* PROFILE */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.navIcon}>
            ○
          </Text>

          <Text style={styles.navText}>
            Profile
          </Text>
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

  /* HEADER */

  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallTitle: {
    color: "#71908F",
    fontSize: 13,
    marginBottom: 4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "800",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#123838",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#245252",
  },

  settingsIcon: {
    color: "#18D6D1",
    fontSize: 22,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#123838",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#245252",
  },

  profileIcon: {
    fontSize: 21,
  },

  /* SEARCH */

  searchContainer: {
    height: 52,
    marginHorizontal: 22,
    marginTop: 22,
    backgroundColor: "#102B2B",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#234747",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchIcon: {
    color: "#18D6D1",
    fontSize: 27,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 9,
  },

  filterIcon: {
    color: "#769392",
    fontSize: 23,
  },

  /* CHAT LIST */

  chatList: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },

  chatItem: {
    height: 78,
    backgroundColor: "#0B2727",
    borderRadius: 19,
    marginVertical: 5,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#173737",
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  onlineDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#18D6D1",
    borderWidth: 2,
    borderColor: "#0B2727",
    right: 0,
    bottom: 1,
  },

  chatInfo: {
    flex: 1,
    marginLeft: 13,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  time: {
    color: "#668180",
    fontSize: 11,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  message: {
    color: "#7F9B9A",
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },

  badge: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#062020",
    fontSize: 11,
    fontWeight: "800",
  },

  /* BOTTOM NAVIGATION */

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    backgroundColor: "#081F1F",
    borderTopWidth: 1,
    borderTopColor: "#183838",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },

  navItem: {
    width: 60,
    alignItems: "center",
  },

  navIcon: {
    color: "#607B7A",
    fontSize: 21,
    marginBottom: 4,
  },

  activeIcon: {
    color: "#18D6D1",
  },

  navText: {
    color: "#607B7A",
    fontSize: 9,
  },

  activeText: {
    color: "#18D6D1",
    fontSize: 9,
    fontWeight: "700",
  },

  /* NEW CHAT BUTTON */

  addButton: {
    width: 53,
    height: 53,
    borderRadius: 27,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    borderWidth: 5,
    borderColor: "#061F1F",
  },

  addText: {
    color: "#062020",
    fontSize: 31,
    fontWeight: "400",
    marginTop: -2,
  },
});