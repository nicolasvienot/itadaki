import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../constants/colors";

interface Props {
  onBack: () => void;
  title?: string;
  /** Float over content (photo screens). Default: false = in-flow cream header. */
  overlay?: boolean;
  /** Use an X (close) icon instead of a chevron — for modal/sheet screens. */
  closeIcon?: boolean;
  /** Optional right slot (e.g., a "Save" link). */
  right?: React.ReactNode;
  /** Larger header for modal/sheet screens (more padding, serif title). */
  large?: boolean;
}

export function ScreenHeader({
  onBack,
  title,
  overlay = false,
  closeIcon = false,
  right,
  large = false,
}: Props) {
  const iconColor = overlay ? "#fff" : colors.ink;
  const btnBg = overlay ? "rgba(0,0,0,0.4)" : colors.surface;
  const borderColor = overlay ? "transparent" : colors.border;

  const titleStyle = large
    ? styles.titleLarge
    : overlay
    ? [styles.title, styles.titleOverlay]
    : styles.title;

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.safe,
        overlay ? styles.overlayContainer : styles.solidContainer,
      ]}
    >
      <View style={[styles.row, large && styles.rowLarge]}>
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: btnBg, borderColor },
          ]}
          onPress={onBack}
          hitSlop={8}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={closeIcon ? "close" : "chevron-left"}
            size={closeIcon ? 18 : 22}
            color={iconColor}
          />
        </TouchableOpacity>

        {title ? (
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.rightSlot}>{right ?? <View style={{ width: 38 }} />}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: "100%" },
  solidContainer: { backgroundColor: colors.bg },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    paddingHorizontal: 20,
    gap: 12,
  },
  rowLarge: {
    height: 64,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.ink,
    textAlign: "center",
  },
  titleLarge: {
    flex: 1,
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
  },
  titleOverlay: {
    color: "#fff",
  },
  rightSlot: {
    minWidth: 38,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
