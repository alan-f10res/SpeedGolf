import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";

import { COLORS } from "../../styles/colors";

export class LoadingOverlay extends Component {
  render() {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: 0.5,
          zIndex: 2,
          backgroundColor: COLORS.pureWhite
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      </View>
    );
  }
}
