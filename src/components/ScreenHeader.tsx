import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../constants/colors";

interface Props {
  onBack: () => void;
  title?: string;
  /** Float over content (photo screens). Default: false = in-flow cream header. */
  overlay?: boolean;
}

export function ScreenHeader({ onBack, title, overlay = false }: Props) {
  const iconColor = overlay ? colors.warmWhite : colors.inkBlack;
  const btnBg = overlay ? "rgba(26,20,16,0.45)" : "rgba(26,20,16,0.07)";

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.safe,
        overlay ? styles.overlayContainer : styles.solidContainer,
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: btnBg }]}
          onPress={onBack}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color={iconColor}
          />
        </TouchableOpacity>

        {title ? (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.spacer} />
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: "100%" },
  solidContainer: { backgroundColor: colors.cream },
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
    height: 52,
    paddingLeft: 16,
    paddingRight: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.inkBlack,
    textAlign: "center",
    marginHorizontal: 8,
  },
  spacer: { width: 44 },
});
