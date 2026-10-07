import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        <View style={styles.chatIllustration}>
          <View style={styles.messageLeft}>
            <Text style={styles.messageText}>Hey 👋</Text>
          </View>

          <View style={styles.messageRight}>
            <Text style={styles.messageText}>Hello!</Text>
          </View>

          <View style={styles.messageLeftSmall}>
            <Text style={styles.messageText}>How are you?</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.heading}>
          Connect with{"\n"}people instantly
        </Text>

        <Text style={styles.description}>
          Chat with your friends, share photos,
          videos and documents — all in one place.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.footer}>
          Simple • Private • Fast
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061F1F",
  },

  topSection: {
    flex: 1.15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  circleOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#0B3939",
    top: 35,
    right: -80,
  },

  circleTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#0E4A49",
    left: -70,
    bottom: 10,
  },

  chatIllustration: {
    width: 285,
    height: 245,
    backgroundColor: "#102B2B",
    borderRadius: 35,
    padding: 22,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },

  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#253D3D",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    marginBottom: 18,
  },

  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#18D6D1",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    marginBottom: 18,
  },

  messageLeftSmall: {
    alignSelf: "flex-start",
    backgroundColor: "#253D3D",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
  },

  messageText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  bottomSection: {
    backgroundColor: "#082626",
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 28,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  heading: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  description: {
    color: "#8EAFAE",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 25,
  },

  button: {
    height: 56,
    backgroundColor: "#18D6D1",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#062020",
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    color: "#062020",
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 12,
  },

  footer: {
    textAlign: "center",
    color: "#527574",
    marginTop: 17,
    fontSize: 12,
  },
});