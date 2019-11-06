import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import { STYLES } from "../../styles/styles";

export class LoginHeader extends Component {
  render() {
    return (
      <View style={STYLES.formContainer}>
        <View style={STYLES.loginHeaderContainer}>
          <Image source={require("../../images/SpeedScoreLogo64Trans.png")} />
          <Text style={STYLES.loginHeaderText}>The Speedgolf App</Text>
        </View>
      </View>
    );
  }
}
