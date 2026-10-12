import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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
      <View style={styles.logoBox}>
        <Text style={styles.logo}>C</Text>
      </View>

      <Text style={styles.title}>ChatFlow</Text>

      <Text style={styles.subtitle}>
        Connect. Chat. Flow.
      </Text>

      <ActivityIndicator
        size="small"
        color="#18D6D1"
        style={styles.loader}
      />
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

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logo: {
    color: "#062020",
    fontSize: 48,
    fontWeight: "900",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#8BA7A5",
    fontSize: 14,
    marginTop: 8,
  },

  loader: {
    marginTop: 35,
  },
});