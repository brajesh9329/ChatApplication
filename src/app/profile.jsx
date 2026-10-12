import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>👤</Text>
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.name}>ChatFlow User</Text>
        <Text style={styles.phone}>+91 XXXXX XXXXX</Text>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active now</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text>👤</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>ChatFlow User</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text>📱</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>+91 XXXXX XXXXX</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text>💬</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.label}>About</Text>
            <Text style={styles.value}>Hey there! I'm using ChatFlow.</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.editButtonText}>✎  Edit Profile</Text>
      </Pressable>

      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.settingsButtonText}>⚙  Settings</Text>
        <Text style={styles.arrow}>›</Text>
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