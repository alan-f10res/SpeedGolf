import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Dimensions
} from "react-native";
import { COLORS } from "../../styles/colors";
import { YourRound } from "../rounds/yourRound";
import { Actions } from "react-native-router-flux";

let screenWidth = Dimensions.get("window").width;
export class SuccessModal extends Component {
  render() {
    let { roundId } = this.props;

    return (
      <View
        style={{
          paddingVertical: 100,
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLORS.blue
        }}
      >
        <Text
          style={{
            color: COLORS.pureWhite,
            fontSize: 24
          }}
        >
          Round Logged Successfully
        </Text>
        <Image source={require("../../images/SpeedScoreLogo64Trans.png")} />
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 20
            }}
          >
            Round Summary:
          </Text>
          <View style={{ flex: 0, flexDirection: "row", width: screenWidth }}>
            <YourRound id={roundId} key={roundId} />
          </View>
        </View>
        <TouchableHighlight
          onPress={() => {
            Actions.rounds();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20
            }}
          >
            Continue
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
