import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const contacts = [
  { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", avatar: "👨", online: true },
  { id: "2", name: "Priya Verma", phone: "+91 87654 32109", avatar: "👩", online: true },
  { id: "3", name: "Aman Singh", phone: "+91 76543 21098", avatar: "🧑", online: false },
  { id: "4", name: "Neha Patel", phone: "+91 65432 10987", avatar: "👩", online: false },
  { id: "5", name: "College Friends", phone: "4 members", avatar: "👥", online: false },
];

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>Contacts</Text>
          <Text style={styles.subtitle}>{contacts.length} contacts</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#668180"
        />
      </View>

      <Text style={styles.sectionTitle}>CHATFLOW CONTACTS</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {contacts.map((contact) => (
          <Pressable
            key={contact.id}
            style={styles.contactCard}
            onPress={() => router.push(`/chat?id=${contact.id}`)}
          >
            <View style={styles.avatarBox}>
              <Text style={styles.avatar}>{contact.avatar}</Text>
              {contact.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.phone}>{contact.phone}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  subtitle: {
    color: "#8BA7A5",
    fontSize: 11,
    marginTop: 3,
  },
  searchBox: {
    height: 49,
    borderRadius: 15,
    backgroundColor: "#0B2929",
    borderWidth: 1,
    borderColor: "#193F3F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 25,
  },
  searchIcon: {
    color: "#18D6D1",
    fontSize: 24,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
  },
  sectionTitle: {
    color: "#668180",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 12,
  },
  contactCard: {
    minHeight: 76,
    backgroundColor: "#0B2929",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#193F3F",
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBox: {
    width: 47,
    height: 47,
    borderRadius: 16,
    backgroundColor: "#173C3C",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    fontSize: 23,
  },
  onlineDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#18D6D1",
    right: -1,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#0B2929",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  phone: {
    color: "#829C9A",
    fontSize: 11,
    marginTop: 5,
  },
  arrow: {
    color: "#718B8A",
    fontSize: 25,
  },
});