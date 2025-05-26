import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";

export default function RootLayout() {
    return (
        <>
            <StatusBar backgroundColor="#ed3e0d" barStyle="light-content" />

            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}
