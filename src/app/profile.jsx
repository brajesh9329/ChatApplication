import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

import { useCallback, useEffect, useState } from "react";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  API_BASE_URL,
  apiRequest,
  getAuthToken,
} from "../constants/Api";

export default function ProfileScreen({ embedded = false, isActive = true }) {
  const params = useLocalSearchParams();

  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    about: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Convert backend image path into complete URL
  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return null;

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    const normalizedPath = path.startsWith("/")
      ? path
      : `/${path}`;

    return `${API_BASE_URL}${normalizedPath}`;
  };

  // Fetch latest profile from database
  const loadProfile = useCallback(async () => {
    if (!userId) {
      setError("User ID nahi mila. Please dobara login karein.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        `/api/users/${encodeURIComponent(userId)}`
      );

      console.log("PROFILE API RESPONSE:", response);
      console.log("PROFILE IMAGE PATH:", response?.profileImage);

      setUser({
        name: response?.name || "",
        phoneNumber: response?.phoneNumber || "",
        email: response?.email || "",
        about: response?.about || "",
        profileImage: response?.profileImage || "",
      });

    } catch (err) {
      console.log("PROFILE LOAD ERROR:", err);

      setError(
        err.message || "Profile load nahi ho paayi."
      );

    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Reload profile whenever screen comes into focus
  // Standalone profile screen: reload on navigation focus
  useFocusEffect(
    useCallback(() => {
      if (!embedded) {
        loadProfile();
      }
    }, [loadProfile, embedded])
  );

  // Embedded profile tab: load whenever tab becomes active
  useEffect(() => {
    if (embedded && isActive) {
      loadProfile();
    }
  }, [embedded, isActive, loadProfile]);

  // Navigate to Edit Profile
  const openEditProfile = () => {
    router.push({
      pathname: "/edit-profile",
      params: {
        userId: String(userId || ""),
        name: user.name,
        phone: user.phoneNumber,
        email: user.email,
        about: user.about,
        profileImage: user.profileImage,
      },
    });
  };

  // Loading Screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#18D6D1"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // Error Screen
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  const imageUrl = getImageUrl(user.profileImage);

  const authToken = getAuthToken();

  // Avoid showing an old cached image
  const imageUri = imageUrl
    ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${encodeURIComponent(
        user.profileImage
      )}`
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: embedded ? 0 : 55 },
      ]}
      showsVerticalScrollIndicator={false}
    >


     {/* Header - standalone screen only */}
     {!embedded && (
       <View style={styles.header}>
         <Pressable
           style={styles.backButton}
           onPress={() => router.back()}
         >
           <Text style={styles.back}>‹</Text>
         </Pressable>

         <Text style={styles.title}>
           My Profile
         </Text>
       </View>
     )}

      {/* Profile Card */}
      <View style={styles.profileCard}>

        <View style={styles.avatarBox}>

          {imageUri ? (

            <Image
              key={imageUri}
              source={{
                uri: imageUri,

                ...(authToken
                  ? {
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                      },
                    }
                  : {}),
              }}
              style={styles.profileImage}
              resizeMode="cover"

              onLoad={() => {
                console.log(
                  "PROFILE IMAGE LOADED:",
                  imageUrl
                );
              }}

              onError={(event) => {
                console.log(
                  "PROFILE IMAGE LOAD ERROR:",
                  event.nativeEvent,
                  "URL:",
                  imageUrl
                );
              }}
            />

          ) : (

            <Text style={styles.avatar}>
              👤
            </Text>

          )}

          <View style={styles.onlineDot} />

        </View>

        <Text style={styles.name}>
          {user.name || "ChatFlow User"}
        </Text>

        <Text style={styles.phone}>
          {user.phoneNumber || "Phone number not available"}
        </Text>

        <View style={styles.statusBadge}>

          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Active now
          </Text>

        </View>

      </View>

      {/* Personal Information */}
      <Text style={styles.sectionTitle}>
        PERSONAL INFORMATION
      </Text>

      <View style={styles.infoCard}>

        {/* Name */}
        <View style={styles.infoRow}>

          <View style={styles.infoIcon}>
            <Text>👤</Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.label}>
              Full Name
            </Text>

            <Text style={styles.value}>
              {user.name || "Not added"}
            </Text>

          </View>

        </View>

        <View style={styles.separator} />

        {/* Phone */}
        <View style={styles.infoRow}>

          <View style={styles.infoIcon}>
            <Text>📱</Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <Text style={styles.value}>
              {user.phoneNumber || "Not available"}
            </Text>

          </View>

        </View>

        <View style={styles.separator} />

        {/* Email */}
        <View style={styles.infoRow}>

          <View style={styles.infoIcon}>
            <Text>✉️</Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.label}>
              Email
            </Text>

            <Text style={styles.value}>
              {user.email || "Not added"}
            </Text>

          </View>

        </View>

        <View style={styles.separator} />

        {/* About */}
        <View style={styles.infoRow}>

          <View style={styles.infoIcon}>
            <Text>💬</Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.label}>
              About
            </Text>

            <Text style={styles.value}>
              {user.about || "Hey there! I'm using ChatFlow."}
            </Text>

          </View>

        </View>

      </View>

      {/* Edit Profile */}
      <Pressable
        style={styles.editButton}
        onPress={openEditProfile}
      >
        <Text style={styles.editButtonText}>
          ✎  Edit Profile
        </Text>
      </Pressable>

      {/* Settings */}
      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >

        <Text style={styles.settingsButtonText}>
          ⚙  Settings
        </Text>

        <Text style={styles.arrow}>
          ›
        </Text>

      </Pressable>

    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },

content: {
  padding: 22,
  paddingBottom: 40,
},

  loadingContainer: {
    flex: 1,
    backgroundColor: "#061F1F",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    color: "#829C9A",
    marginTop: 12,
    fontSize: 13,
  },

  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#18D6D1",
  },

  retryText: {
    color: "#062020",
    fontWeight: "800",
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

  profileCard: {
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 28,
  },

  avatarBox: {
    width: 92,
    height: 92,
    borderRadius: 31,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },

  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 31,
  },

  avatar: {
    fontSize: 43,
  },

  onlineDot: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#18D6D1",
    right: 0,
    bottom: 1,
    borderWidth: 3,
    borderColor: "#0B2929",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 16,
  },

  phone: {
    color: "#8BA7A5",
    fontSize: 12,
    marginTop: 7,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#123939",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 14,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#18D6D1",
    marginRight: 6,
  },

  statusText: {
    color: "#18D6D1",
    fontSize: 10,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#668180",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#0B2929",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#193F3F",
    paddingHorizontal: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#123939",
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  label: {
    color: "#708B8A",
    fontSize: 11,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 5,
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#193F3F",
  },

  editButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  editButtonText: {
    color: "#062020",
    fontSize: 14,
    fontWeight: "800",
  },

  settingsButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  settingsButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  arrow: {
    color: "#718B8A",
    fontSize: 24,
  },

});