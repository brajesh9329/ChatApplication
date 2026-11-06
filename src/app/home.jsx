import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  RefreshControl,
  Image,
  Animated,
  Easing,
  Keyboard,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Skeleton from "../components/Skeleton";
import ContactsScreen from "./contacts";
import ProfileScreen from "./profile";

import {
  apiRequest,
  API_BASE_URL,
  getAuthToken,
} from "../constants/Api";

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

const C = {
  bg: "#061F1F",
  card: "#0B2929",
  cardFocus: "#0D3030",
  nav: "#0A2929",
  accent: "#18D6D1",
  accentSoft: "rgba(24, 214, 209, 0.12)",
  accentLine: "rgba(24, 214, 209, 0.28)",
  text: "#FFFFFF",
  textSecondary: "#829C9A",
  textMuted: "#668180",
  border: "#193F3F",
  borderSecondary: "#173B3B",
  avatarBg: "#173C3C",
  onAccent: "#062020",
};

const MIN_LOADING_MS = 250;

const TABS = [
  {
    key: "chats",
    label: "Chats",
    icon: "chatbubbles-outline",
    activeIcon: "chatbubbles",
  },
  {
    key: "groups",
    label: "Groups",
    icon: "people-outline",
    activeIcon: "people",
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: "person-add-outline",
    activeIcon: "person-add",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatChatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
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

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

/* ------------------------------------------------------------------ */
/* Reusable components                                                 */
/* ------------------------------------------------------------------ */

function PressableScale({
  children,
  style,
  containerStyle,
  onPress,
  scaleTo = 0.97,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      style={containerStyle}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function NewChatButton({ onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      style={styles.newChatButton}
      scaleTo={0.95}
      accessibilityLabel="Start a new chat"
    >
      <Ionicons name="add" size={19} color={C.onAccent} />
      <Text style={styles.newChatText}>New Chat</Text>
    </PressableScale>
  );
}

const ChatRow = memo(function ChatRow({ chat, index, seenIds, onPress }) {
  const shouldAnimate = useRef(!seenIds.has(chat.id)).current;
  const entrance = useRef(
    new Animated.Value(shouldAnimate ? 0 : 1)
  ).current;

  useEffect(() => {
    seenIds.add(chat.id);
    if (!shouldAnimate) return undefined;

    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 300,
      delay: Math.min(index, 8) * 40,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  return (
    <Animated.View
      style={{
        opacity: entrance,
        transform: [{ translateY }],
      }}
    >
      <PressableScale
        style={styles.chatCard}
        onPress={() => onPress(chat)}
        scaleTo={0.975}
      >
        <View style={styles.avatarContainer}>
          {chat.profileImage ? (
            <Image
              source={{
                uri: `${getImageUrl(chat.profileImage)}?t=${encodeURIComponent(
                  chat.profileImage
                )}`,
                headers: {
                  Authorization: `Bearer ${getAuthToken()}`,
                },
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.avatar,
                chat.type === "GROUP" && styles.avatarGroup,
              ]}
            >
              <Text style={styles.avatarText}>{chat.avatar}</Text>
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.chatName} numberOfLines={1}>
            {chat.name}
          </Text>

          <Text
            style={[
              styles.lastMessage,
              chat.message === "No messages yet" && styles.lastMessageEmpty,
            ]}
            numberOfLines={1}
          >
            {chat.message}
          </Text>
        </View>

        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
});

function ChatListSkeleton() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fade, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [fade]);

  return (
    <Animated.View style={[styles.chatList, { opacity: fade }]}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.chatCard}>
          <Skeleton width={52} height={52} radius={18} />

          <View style={styles.chatInfo}>
            <Skeleton width="55%" height={14} />
            <Skeleton
              width="80%"
              height={11}
              style={{ marginTop: 10 }}
            />
          </View>

          <Skeleton width={38} height={9} />
        </View>
      ))}
    </Animated.View>
  );
}

function StateIcon({ name }) {
  return (
    <View style={styles.stateIconRing}>
      <View style={styles.stateIconInner}>
        <Ionicons name={name} size={30} color={C.accent} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom navigation                                                   */
/* ------------------------------------------------------------------ */

function BottomNavigation({
  activeTab,
  onTabPress,
  bubblePosition,
  itemWidth,
  profileIcon,
}) {
  return (
    <View style={styles.bottomNav}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeBubble,
          {
            width: itemWidth - 12,
            transform: [{ translateX: bubblePosition }],
          },
        ]}
      />

      {TABS.map((tab, index) => {
        const active = activeTab === index;

        return (
          <Pressable
            key={tab.key}
            style={styles.navItem}
            onPress={() => onTabPress(index)}
            android_ripple={{
              color: C.accentSoft,
              borderless: true,
            }}
          >
            <View style={styles.navIconWrap}>
              {tab.key === "profile" && profileIcon ? (
                profileIcon
              ) : (
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={22}
                  color={active ? C.accent : C.textMuted}
                />
              )}
            </View>

            <Text
              style={[
                styles.navText,
                active && styles.navTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Home screen                                                         */
/* ------------------------------------------------------------------ */

export default function HomeScreen() {
  const { userId, name, phone, profileImage, about } =
    useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [latestProfileImage, setLatestProfileImage] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [navAvatarFailed, setNavAvatarFailed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const hasLoadedChats = useRef(false);
  const loadTimer = useRef(null);
  const searchRef = useRef(null);
  const seenIds = useRef(new Set()).current;
  const pagerRef = useRef(null);

  const bubbleAnimation = useRef(new Animated.Value(0)).current;

  const currentUserId = Array.isArray(userId) ? userId[0] : userId;
  const displayName = Array.isArray(name) ? name[0] : name;
  const currentUserPhone = Array.isArray(phone) ? phone[0] : phone;

  const routeProfileImage = Array.isArray(profileImage)
    ? profileImage[0]
    : profileImage;

  const currentProfileImage =
    latestProfileImage !== null
      ? latestProfileImage
      : routeProfileImage;

  const currentAbout = Array.isArray(about) ? about[0] : about;

  const itemWidth = (width - 16) / 4;

  /* ---------- animations ---------- */

  const entrance = useRef(new Animated.Value(0)).current;
  const brandEntrance = useRef(new Animated.Value(0)).current;
  const searchFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(brandEntrance, {
        toValue: 1,
        duration: 400,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [entrance, brandEntrance]);

  useEffect(() => {
    return () => {
      if (loadTimer.current) {
        clearTimeout(loadTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.spring(bubbleAnimation, {
      toValue: activeTab,
      speed: 22,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  }, [activeTab, bubbleAnimation]);

  const bubblePosition = bubbleAnimation.interpolate({
    inputRange: [0, 3],
    outputRange: [6, itemWidth * 3 + 6],
  });

  const animateSearch = (value) => {
    Animated.timing(searchFocus, {
      toValue: value,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const searchBorder = searchFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.accent],
  });

  const searchGlow = searchFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  const searchBg = searchFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [C.card, C.cardFocus],
  });

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );

    const hide = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    setNavAvatarFailed(false);
  }, [currentProfileImage]);

  /* ---------- API ---------- */

  const loadUserProfile = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const response = await apiRequest(
        `/api/users/${encodeURIComponent(currentUserId)}`
      );

      setLatestProfileImage(response?.profileImage || "");
    } catch (err) {
      console.log("HOME PROFILE IMAGE ERROR:", err);
    }
  }, [currentUserId]);

  const loadChats = useCallback(
    async (isRefresh = false) => {
      if (!currentUserId) {
        setError("User ID nahi mila. Please dobara login karein.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const showSkeleton = !isRefresh && !hasLoadedChats.current;
      const startedAt = Date.now();

      if (isRefresh) {
        setRefreshing(true);
      } else if (showSkeleton) {
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
            profileImage: item.profileImage,
            avatar: item.type === "GROUP" ? "👥" : "👤",
          }))
        );

        hasLoadedChats.current = true;
      } catch (err) {
        if (isRefresh || !hasLoadedChats.current) {
          setError(err.message || "Chats load nahi ho paayi.");
        }
      } finally {
        const wait =
          showSkeleton || isRefresh
            ? Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt))
            : 0;

        if (loadTimer.current) {
          clearTimeout(loadTimer.current);
        }

        const finish = () => {
          loadTimer.current = null;
          setLoading(false);
          setRefreshing(false);
        };

        if (wait > 0) {
          loadTimer.current = setTimeout(finish, wait);
        } else {
          finish();
        }
      }
    },
    [currentUserId]
  );

  useFocusEffect(
    useCallback(() => {
      loadChats();
      loadUserProfile();
    }, [loadChats, loadUserProfile])
  );

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.message.toLowerCase().includes(query)
    );
  }, [chats, search]);

  /* ---------- navigation ---------- */

  const openSearch = useCallback(() => {
    router.push({
      pathname: "/search",
      params: {
        userId: String(currentUserId || ""),
      },
    });
  }, [currentUserId]);

  const openChat = useCallback(
    (chat) => {
      router.push({
        pathname: "/chat",
        params: {
          id: chat.id,
          chatId: chat.id,
          userId: String(currentUserId || ""),
          participantId:
            chat.participantId != null
              ? String(chat.participantId)
              : "",
          name: chat.name,
          phone: String(currentUserPhone || ""),
          profileImage: chat.profileImage || "",
        },
      });
    },
    [currentUserId, currentUserPhone]
  );

  const changeTab = useCallback(
    (index) => {
      setActiveTab(index);
      Keyboard.dismiss();

      pagerRef.current?.scrollTo({
        x: width * index,
        y: 0,
        animated: true,
      });
    },
    [width]
  );

  const handlePageSwipe = useCallback(
    (event) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / width);

      if (nextIndex >= 0 && nextIndex <= 3) {
        setActiveTab(nextIndex);
      }
    },
    [width]
  );

  /* ---------- profile tab avatar ---------- */

  const profileTabIcon =
    currentProfileImage && !navAvatarFailed ? (
      <Image
        source={{
          uri: `${getImageUrl(currentProfileImage)}?t=${encodeURIComponent(
            currentProfileImage
          )}`,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }}
        style={styles.navAvatar}
        resizeMode="cover"
        onError={() => setNavAvatarFailed(true)}
      />
    ) : (
      <Ionicons
        name={activeTab === 3 ? "person" : "person-outline"}
        size={22}
        color={activeTab === 3 ? C.accent : C.textMuted}
      />
    );

  const entranceTranslate = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const brandTranslate = brandEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  /* ---------- UI ---------- */

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mainContent,
          {
            paddingTop: Math.max(insets.top, 24) + 10,
            opacity: entrance,
            transform: [{ translateY: entranceTranslate }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Top Center ChatLab */}
          <Animated.View
            style={[
              styles.brand,
              {
                opacity: brandEntrance,
                transform: [{ translateY: brandTranslate }],
              },
            ]}
          >
            <View style={styles.brandRow}>
              <Text style={styles.brandChat}>Chat</Text>
              <Text style={styles.brandLab}>Lab</Text>

              <View style={styles.dotWrap}>
                <View style={styles.dotGlow} />
                <View style={styles.dot} />
              </View>
            </View>

            <View style={styles.brandUnderline} />
          </Animated.View>

          {/* Left Welcome + Active Tab / Right New Chat */}
          <View style={styles.headerBottom}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting} numberOfLines={1}>
                Welcome{displayName ? `, ${displayName}` : " back"} 👋
              </Text>

              <Text style={styles.headerTitle}>
                {TABS[activeTab].label}
              </Text>
            </View>

            <NewChatButton onPress={openSearch} />
          </View>
        </View>

        {/* Swipeable pages */}
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handlePageSwipe}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="handled"
          directionalLockEnabled
          style={styles.pager}
          contentContainerStyle={styles.pagerContent}
        >
          {/* Chats tab */}
          <View style={[styles.page, { width }]}>
            {/* Search */}
            <Animated.View
              style={[
                styles.searchBox,
                {
                  borderColor: searchBorder,
                  backgroundColor: searchBg,
                  shadowOpacity: searchGlow,
                },
              ]}
            >
              <View style={styles.searchPressable}>
                <Ionicons
                  name="search"
                  size={19}
                  color={C.accent}
                  style={styles.searchIcon}
                />

                <TextInput
                  ref={searchRef}
                  style={styles.searchInput}
                  placeholder="Search conversations..."
                  placeholderTextColor={C.textMuted}
                  value={search}
                  onChangeText={setSearch}
                  onFocus={() => animateSearch(1)}
                  onBlur={() => animateSearch(0)}
                  autoCapitalize="none"
                  selectionColor={C.accent}
                  returnKeyType="search"
                />

                {search.length > 0 && (
                  <Pressable
                    onPress={() => setSearch("")}
                    hitSlop={10}
                    accessibilityLabel="Clear search"
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={C.textMuted}
                    />
                  </Pressable>
                )}
              </View>
            </Animated.View>

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Chats</Text>

              <View style={styles.countPill}>
                <Text style={styles.count}>
                  {chats.length} conversations
                </Text>
              </View>
            </View>

            {/* Chat list */}
            {loading ? (
              <ChatListSkeleton />
            ) : error ? (
              <View style={styles.stateContainer}>
                <StateIcon name="cloud-offline-outline" />

                <Text style={styles.stateText}>{error}</Text>

                <PressableScale
                  style={styles.retryButton}
                  onPress={() => loadChats()}
                  scaleTo={0.95}
                >
                  <Ionicons
                    name="refresh"
                    size={14}
                    color={C.onAccent}
                  />
                  <Text style={styles.retryText}>Try Again</Text>
                </PressableScale>
              </View>
            ) : (
              <ScrollView
                style={styles.chatScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.chatList,
                  filteredChats.length === 0 && styles.emptyChatList,
                ]}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => loadChats(true)}
                    tintColor={C.accent}
                    colors={[C.accent]}
                    progressBackgroundColor={C.card}
                  />
                }
                keyboardShouldPersistTaps="handled"
              >
                {filteredChats.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <StateIcon
                      name={
                        search.trim()
                          ? "search-outline"
                          : "chatbubbles-outline"
                      }
                    />

                    <Text style={styles.emptyTitle}>
                      {search.trim() ? "No matching chats" : "No chats yet"}
                    </Text>

                    <Text style={styles.stateText}>
                      {search.trim()
                        ? "Try another name or message."
                        : "Start a conversation to see it here."}
                    </Text>

                    {!search.trim() && (
                      <PressableScale
                        style={styles.retryButton}
                        onPress={openSearch}
                        scaleTo={0.95}
                      >
                        <Ionicons
                          name="person-add"
                          size={14}
                          color={C.onAccent}
                        />
                        <Text style={styles.retryText}>Find People</Text>
                      </PressableScale>
                    )}
                  </View>
                ) : (
                  filteredChats.map((chat, index) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      index={index}
                      seenIds={seenIds}
                      onPress={openChat}
                    />
                  ))
                )}
              </ScrollView>
            )}
          </View>

          {/* Groups tab */}
          <View style={[styles.page, styles.groupsPage, { width }]}>
            <View style={styles.groupsEmpty}>
              <View style={styles.groupsIconRing}>
                <View style={styles.groupsIconInner}>
                  <Ionicons
                    name="people-outline"
                    size={34}
                    color={C.accent}
                  />
                </View>
              </View>

              <Text style={styles.groupsTitle}>Your Groups</Text>

              <Text style={styles.groupsSubtitle}>
                Your group conversations will appear here.
              </Text>
            </View>
          </View>

          {/* Contacts tab */}
          <View style={[styles.page, styles.embeddedPage, { width }]}>
            <ContactsScreen embedded isActive={activeTab === 2} />
          </View>

          {/* Profile tab */}
          <View style={[styles.page, styles.embeddedPage, { width }]}>
            <ProfileScreen embedded isActive={activeTab === 3} />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Bottom navigation */}
      {!keyboardVisible && (
        <View
          style={[
            styles.bottomNavContainer,
            {
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <BottomNavigation
            activeTab={activeTab}
            onTabPress={changeTab}
            bubblePosition={bubblePosition}
            itemWidth={itemWidth}
            profileIcon={profileTabIcon}
          />
        </View>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: "hidden",
  },

  mainContent: {
    flex: 1,
  },

  /* Header */

  header: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 8,
    position: "relative",
  },

  brand: {
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 42,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },

  greeting: {
    color: C.textSecondary,
    fontSize: 12,
    letterSpacing: 0.2,
  },

  headerTitle: {
    color: C.text,
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 3,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandChat: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  brandLab: {
    color: C.accent,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  dotWrap: {
    width: 13,
    height: 13,
    marginLeft: 3,
    marginTop: -8,
    alignItems: "center",
    justifyContent: "center",
  },

  dotGlow: {
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: C.accentSoft,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },

  brandUnderline: {
    marginTop: 4,
    width: 25,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.accent,
    opacity: 0.85,
  },

  newChatButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: C.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  newChatText: {
    color: C.onAccent,
    fontSize: 11,
    fontWeight: "800",
  },

  /* Pager */

  pager: {
    flex: 1,
  },

  pagerContent: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
    backgroundColor: C.bg,
  },

  embeddedPage: {
    paddingHorizontal: 0,
    paddingTop: 4,
  },

  /* Search */

  searchBox: {
    height: 49,
    marginHorizontal: 20,
    marginTop: 19,
    marginBottom: 22,
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: C.accent,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  searchPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    paddingVertical: 0,
    height: "100%",
  },

  /* Section header */

  sectionHeader: {
    paddingHorizontal: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.borderSecondary,
  },

  count: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },

  /* Chat list */

  chatScroll: {
    flex: 1,
  },

  chatList: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  emptyChatList: {
    flexGrow: 1,
  },

  chatCard: {
    minHeight: 78,
    backgroundColor: C.card,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: C.avatarBg,
    borderWidth: 1,
    borderColor: C.borderSecondary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 24,
  },

  avatarGroup: {
    backgroundColor: C.accentSoft,
    borderColor: C.accentLine,
  },

  chatInfo: {
    flex: 1,
    marginLeft: 13,
  },

  chatName: {
    color: C.text,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  lastMessage: {
    color: C.textSecondary,
    fontSize: 12.5,
    marginTop: 5,
  },

  lastMessageEmpty: {
    color: C.textMuted,
    fontStyle: "italic",
  },

  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
    minWidth: 44,
  },

  chatTime: {
    color: C.textMuted,
    fontSize: 10.5,
    fontWeight: "500",
  },

  /* Empty / error */

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 35,
  },

  stateIconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  stateIconInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },

  stateText: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: C.accent,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: C.accent,
    shadowOpacity: 0.25,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  retryText: {
    color: C.onAccent,
    fontSize: 13,
    fontWeight: "800",
  },

  /* Groups empty state */

  groupsPage: {
    alignItems: "center",
    justifyContent: "center",
  },

  groupsEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    marginTop: -35,
  },

  groupsIconRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  groupsIconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },

  groupsTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  groupsSubtitle: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 9,
    maxWidth: 250,
  },

  /* Bottom navigation */

  bottomNavContainer: {
    backgroundColor: C.nav,
    borderTopWidth: 1,
    borderTopColor: C.borderSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },

  bottomNav: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    position: "relative",
  },

  activeBubble: {
    position: "absolute",
    left: 8,
    top: 8,
    height: 34,
    borderRadius: 18,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
  },

  navItem: {
    flex: 1,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  navIconWrap: {
    width: 46,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: C.textMuted,
    fontSize: 10,
    marginTop: 3,
    fontWeight: "500",
  },

  navTextActive: {
    color: C.accent,
    fontWeight: "800",
  },

  navAvatar: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.accent,
    backgroundColor: C.avatarBg,
  },
});