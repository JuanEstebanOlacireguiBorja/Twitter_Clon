import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Header({ title, onLogout }) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>{title}</Text>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, backgroundColor: "#D8E3E2", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 20, fontWeight: "700", color: "#354F52" },
  logout: { color: "#2D6A4F", fontWeight: "600" }
});
