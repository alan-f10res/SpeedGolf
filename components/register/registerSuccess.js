import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { STYLES } from "../../styles/styles";
import { COLORS } from "../../styles/colors";

export class SuccessfulRegistration extends Component {
  render() {
    return (
      <View
        style={[
          STYLES.container,
          {
            backgroundColor: COLORS.blue
          }
        ]}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 120
          }}
        >
          <Image source={require("../../images/SpeedScoreLogo64Trans.png")} />
          <Text
            style={{
              color: COLORS.lightGrey,
              fontSize: 20
            }}
          >
            Registered Successfully!
          </Text>
        </View>
        <View
          style={{
            flex: 0
          }}
        >
          <Button
            backgroundColor={COLORS.lightGrey}
            color={COLORS.blue}
            title="Set Up Profile"
            onPress={() =>
              Actions.profile({
                initialIndex: 1
              })
            }
          />
          <TouchableOpacity
            style={{
              marginTop: 20
            }}
            onPress={Actions.homeStack}
          >
            <Text
              style={{
                color: COLORS.lightGrey,
                textDecorationLine: "underline",
                textAlign: "center"
              }}
            >
              Skip for now
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.lightGrey,
              textAlign: "center"
            }}
          >
            (You can always update them later)
          </Text>
        </View>
      </View>
    );
  }
}
