import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoBubble}>
          <Text style={styles.logoIcon}>✦</Text>
        </View>
      </View>

      <Text style={styles.title}>ChatFlow</Text>

      <Text style={styles.subtitle}>
        Connect. Chat. Share.
      </Text>

      <View style={styles.loadingTrack}>
        <View style={styles.loadingBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginBottom: 20,
  },

  logoBubble: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-8deg" }],
  },

  logoIcon: {
    fontSize: 42,
    color: "#061F1F",
    fontWeight: "bold",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    color: "#91B9B8",
  },

  loadingTrack: {
    width: 120,
    height: 4,
    backgroundColor: "#244545",
    borderRadius: 10,
    marginTop: 35,
    overflow: "hidden",
  },

  loadingBar: {
    width: 55,
    height: 4,
    backgroundColor: "#18D6D1",
    borderRadius: 10,
  },
});