import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";

const contacts = [
  ["Rahul Sharma", "12"],
  ["Aman Verma", "13"],
  ["Priya Singh", "47"],
  ["Rohan Patel", "11"],
  ["Neha Gupta", "44"],
];

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <Text style={styles.subtitle}>People on ChatFlow</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 22 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.contact}
            onPress={() => router.push("/chat")}
          >
            <Image
              source={{
                uri: `https://i.pravatar.cc/150?img=${item[1]}`,
              }}
              style={styles.avatar}
            />

            <View style={styles.info}>
              <Text style={styles.name}>{item[0]}</Text>
              <Text style={styles.status}>Available on ChatFlow</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#789493",
    fontSize: 14,
    marginTop: 5,
  },

  contact: {
    height: 76,
    backgroundColor: "#0B2929",
    borderRadius: 18,
    marginBottom: 9,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#193F3F",
  },

  avatar: {
    width: 51,
    height: 51,
    borderRadius: 26,
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  name: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  status: {
    color: "#18D6D1",
    fontSize: 11,
    marginTop: 5,
  },

  arrow: {
    color: "#6F8B8A",
    fontSize: 28,
  },
});