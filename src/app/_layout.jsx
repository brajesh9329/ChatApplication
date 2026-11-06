
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        style="light"
        backgroundColor="#061F1F"
        translucent={false}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: {
            backgroundColor: "#061F1F",
          },
        }}
      />
    </>
  );
}
