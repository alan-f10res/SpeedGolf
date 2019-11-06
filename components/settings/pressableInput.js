import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FormLabel } from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

export class PressableInput extends PureComponent {
  render() {
    const {
      label,
      value,
      error,
      onPress,
      styleOverride,
      fontColor,
      placeHolder,
      ...rest
    } = this.props;
    return (
      <TouchableOpacity
        style={{ styleOverride }}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
      >
        <View>
          <FormLabel labelStyle={STYLES.formLabel}>{label}</FormLabel>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              borderBottomColor: fontColor || "black",
              borderBottomWidth: 1
            }}
          >
            <Text
              style={{
                color: fontColor || COLORS.blue,
                minHeight: 36,
                lineHeight: 36,
                fontSize: 18
              }}
            >
              {value || placeHolder}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
