import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>C</Text>
      </View>

      <Text style={styles.title}>ChatFlow</Text>

      <Text style={styles.subtitle}>
        Conversations that flow naturally.
      </Text>

      <View style={styles.preview}>
        <View style={styles.otherBubble}>
          <Text style={styles.message}>Hey! What's up? 👋</Text>
        </View>

        <View style={styles.myBubble}>
          <Text style={styles.message}>All good! 😄</Text>
        </View>

        <View style={styles.otherBubble}>
          <Text style={styles.message}>Let's catch up!</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.description}>
          Stay connected with the people who matter.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.footer}>
          Simple. Private. Connected.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
    padding: 26,
    paddingTop: 75,
    alignItems: "center",
  },
  logoBox: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: "#18D6D1",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: "#062020",
    fontSize: 40,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "800",
    marginTop: 16,
  },
  subtitle: {
    color: "#8BA7A5",
    fontSize: 13,
    marginTop: 8,
  },
  preview: {
    width: "100%",
    marginTop: 45,
    gap: 17,
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#172F2F",
    paddingHorizontal: 17,
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#18BDB9",
    paddingHorizontal: 17,
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomRightRadius: 5,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  bottom: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 25,
  },
  description: {
    color: "#A3BCBA",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 22,
  },
  button: {
    height: 56,
    backgroundColor: "#18D6D1",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#062020",
    fontSize: 15,
    fontWeight: "800",
  },
  arrow: {
    color: "#062020",
    fontSize: 22,
    marginLeft: 10,
  },
  footer: {
    color: "#557775",
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },
});