import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { router } from "expo-router";

const BG = "#061F1F";
const CARD = "#0B2929";
const CYAN = "#18D6D1";
const WHITE = "#FFFFFF";
const MUTED = "#9BB5B5";

export default function ExploreScreen() {
  const sections = [
    {
      title: "File-based routing",
      description:
        "ChatFlow uses Expo Router to navigate between screens such as Login, Chats, Contacts and Profile.",
    },
    {
      title: "ChatFlow features",
      description:
        "ChatFlow is designed for messaging, contact discovery and profile management. Backend integration will be added separately.",
    },
    {
      title: "JavaScript version",
      description:
        "This screen is written in JavaScript JSX instead of TypeScript TSX.",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹  Back</Text>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.title}>Explore ChatFlow</Text>
        <Text style={styles.subtitle}>
          Discover your messaging experience
        </Text>
      </View>

      {sections.map((section, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{section.title}</Text>
          <Text style={styles.cardDescription}>{section.description}</Text>
        </View>
      ))}

      <Pressable
        style={styles.button}
        onPress={() => Linking.openURL("https://docs.expo.dev/")}
      >
        <Text style={styles.buttonText}>Expo Documentation ↗</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 22,
  },
  backText: {
    color: CYAN,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: CYAN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logoText: {
    color: CYAN,
    fontSize: 38,
    fontWeight: "bold",
  },
  title: {
    color: WHITE,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#174141",
  },
  cardTitle: {
    color: CYAN,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    backgroundColor: CYAN,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: BG,
    fontSize: 15,
    fontWeight: "bold",
  },
});
