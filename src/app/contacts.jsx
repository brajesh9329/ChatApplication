
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";

import { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest } from "../constants/Api";

export default function ContactsScreen({ embedded = false, isActive = true }) {
  const params = useLocalSearchParams();

  // Chat screen requires the logged-in user's ID.
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openingId, setOpeningId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [saving, setSaving] = useState(false);

  // Load contacts from backend
  const loadContacts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiRequest("/api/contacts");

      if (!Array.isArray(response)) {
        throw new Error("Invalid contacts response.");
      }

      setContacts(response);
    } catch (error) {
      console.log("LOAD CONTACTS ERROR:", error.message);
      Alert.alert("Error", error.message || "Contacts load nahi ho paaye.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

useEffect(() => {
  if (isActive) {
    loadContacts();
  }
}, [loadContacts, isActive]);

  // Search contacts
  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return contacts;

    return contacts.filter((contact) => {
      const name = (
        contact.savedName ||
        contact.contactName ||
        ""
      ).toLowerCase();

      const originalName = (contact.contactName || "").toLowerCase();
      const phone = (contact.phoneNumber || "").toLowerCase();

      return (
        name.includes(query) ||
        originalName.includes(query) ||
        phone.includes(query)
      );
    });
  }, [contacts, search]);

  // Create or get direct chat
  const openChat = async (contact) => {
    if (!userId) {
      Alert.alert(
        "User ID missing",
        "Contacts screen ko open karte waqt userId pass nahi hua. Home screen navigation update karo."
      );
      return;
    }

    try {
      setOpeningId(String(contact.contactUserId));

      const response = await apiRequest(
        `/api/chats/direct?otherUserId=${encodeURIComponent(
          contact.contactUserId
        )}`,
        {
          method: "POST",
        }
      );

      if (!response?.id) {
        throw new Error("Backend se valid chat ID nahi mili.");
      }

      router.push({
        pathname: "/chat",
        params: {
          chatId: String(response.id),
          userId: String(userId),
          participantId: String(contact.contactUserId),
          name: contact.savedName || contact.contactName || "Chat",
          phone: contact.phoneNumber || "",
        },
      });
    } catch (error) {
      console.log("OPEN CHAT ERROR:", error.message);
      Alert.alert("Chat Error", error.message || "Chat open nahi ho paayi.");
    } finally {
      setOpeningId(null);
    }
  };

  // Open edit modal
  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setEditedName(contact.savedName || contact.contactName || "");
    setModalVisible(true);
  };

  // Update private contact name
  const updateContactName = async () => {
    const name = editedName.trim();

    if (!name) {
      Alert.alert("Invalid Name", "Contact name empty nahi ho sakta.");
      return;
    }

    if (!selectedContact) return;

    try {
      setSaving(true);

      await apiRequest(
        `/api/contacts/${encodeURIComponent(
          selectedContact.contactUserId
        )}`,
        {
          method: "PUT",
          body: JSON.stringify({
            savedName: name,
          }),
        }
      );

      setContacts((previous) =>
        previous.map((contact) =>
          String(contact.contactUserId) ===
          String(selectedContact.contactUserId)
            ? { ...contact, savedName: name }
            : contact
        )
      );

      setModalVisible(false);
      setSelectedContact(null);

      Alert.alert("Success", "Contact name updated successfully.");
    } catch (error) {
      console.log("UPDATE CONTACT ERROR:", error.message);
      Alert.alert("Error", error.message || "Name update nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  // Delete contact
  const deleteContact = (contact) => {
    const displayName =
      contact.savedName || contact.contactName || "this contact";

    Alert.alert(
      "Remove Contact",
      `Are you sure you want to remove ${displayName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(
                `/api/contacts/${encodeURIComponent(
                  contact.contactUserId
                )}`,
                {
                  method: "DELETE",
                }
              );

              setContacts((previous) =>
                previous.filter(
                  (item) =>
                    String(item.contactUserId) !==
                    String(contact.contactUserId)
                )
              );
            } catch (error) {
              console.log("DELETE CONTACT ERROR:", error.message);
              Alert.alert(
                "Error",
                error.message || "Contact remove nahi hua."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: embedded ? 0 : 55 },
      ]}
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

          <View>
            <Text style={styles.title}>Contacts</Text>
            <Text style={styles.subtitle}>
              {contacts.length} contacts
            </Text>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#668180"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CHATFLOW CONTACTS</Text>

        <Pressable onPress={() => loadContacts(true)}>
          <Text style={styles.refreshText}>
            {refreshing ? "Loading..." : "Refresh ↻"}
          </Text>
        </Pressable>
      </View>

      {/* Contact list */}
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#18D6D1" />
          <Text style={styles.stateText}>Loading contacts...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredContacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>

              <Text style={styles.emptyTitle}>
                {search ? "No contacts found" : "No contacts yet"}
              </Text>

              <Text style={styles.stateText}>
                {search
                  ? "Try another name or phone number."
                  : "Your saved contacts will appear here."}
              </Text>
            </View>
          ) : (
           
filteredContacts.map((contact) => {
  const displayName =
    contact.savedName ||
    contact.contactName ||
    "Unknown User";

  const isOpening =
    openingId === String(contact.contactUserId);

  return (
    <View
      key={String(contact.contactUserId)}
      style={styles.contactCard}
    >
      <Pressable
        style={styles.contactMain}
        onPress={() => openChat(contact)}
        disabled={!!openingId}
      >
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>👤</Text>
        </View>

        <View style={styles.contactInfo}>
          <Text
            style={styles.contactName}
            numberOfLines={1}
          >
            {displayName}
          </Text>

          <Text
            style={styles.phone}
            numberOfLines={1}
          >
            {contact.phoneNumber || ""}
          </Text>

          {contact.savedName &&
            contact.contactName &&
            contact.savedName !== contact.contactName && (
              <Text style={styles.originalName}>
                Profile: {contact.contactName}
              </Text>
            )}
        </View>

        {isOpening ? (
          <ActivityIndicator
            size="small"
            color="#18D6D1"
          />
        ) : (
          <Text style={styles.arrow}>›</Text>
        )}
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => openEditModal(contact)}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => deleteContact(contact)}
        >
          <Text style={styles.deleteText}>Reset Name</Text>
        </Pressable>
      </View>
    </View>
  );
})

          )}
        </ScrollView>
      )}

      {/* Edit contact modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Contact Name</Text>

            <Text style={styles.modalSubtitle}>
              This name will be visible only to you.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter contact name"
              placeholderTextColor="#668180"
              value={editedName}
              onChangeText={setEditedName}
              autoFocus
              maxLength={100}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={updateContactName}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#062020" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#061F1F",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#668180",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  refreshText: {
    color: "#18D6D1",
    fontSize: 11,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 25,
  },
  contactCard: {
    minHeight: 76,
    backgroundColor: "#0B2929",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#193F3F",
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  contactMain: {
    minHeight: 55,
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
  },
  avatar: {
    fontSize: 23,
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
  originalName: {
    color: "#668180",
    fontSize: 10,
    marginTop: 3,
  },
  arrow: {
    color: "#718B8A",
    fontSize: 25,
    paddingHorizontal: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#193F3F",
    marginTop: 9,
    paddingTop: 7,
    gap: 17,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  editText: {
    color: "#18D6D1",
    fontSize: 11,
    fontWeight: "700",
  },
  deleteText: {
    color: "#FF8585",
    fontSize: 11,
    fontWeight: "700",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    color: "#829C9A",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: "#0B2929",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#234747",
    padding: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: "#829C9A",
    fontSize: 11,
    marginTop: 7,
    marginBottom: 18,
  },
  modalInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#315555",
    backgroundColor: "#061F1F",
    color: "#FFFFFF",
    paddingHorizontal: 13,
    fontSize: 13,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#173C3C",
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  saveButton: {
    minWidth: 75,
    alignItems: "center",
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#18D6D1",
  },
  saveText: {
    color: "#062020",
    fontSize: 12,
    fontWeight: "800",
  },
});
