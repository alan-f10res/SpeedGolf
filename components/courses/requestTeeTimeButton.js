import React, { Component } from "react";
import {
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Alert
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../../styles/colors";

export class RequestTeeTimeButton extends Component {
  constructor(props) {
    super(props);
  }

  linkToRequestTeeTimeForm = () => {
    return Actions.requestTeeTimeForm({
      courseId: this.props.courseId
    });
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.touchableButton}
        onPress={() =>
          Alert.alert("Requesting tee times coming in version 2.0...")
        }
      >
        <View style={styles.innerContainer}>
          <Icon name="book" color={COLORS.pureWhite} size={12} />
          <Text style={styles.buttonText}>Tee Times</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchableButton: {
    height: 30,
    backgroundColor: COLORS.blue,
    padding: 8,
    flex: 0,
    margin: 2,
    zIndex: 2
  },
  buttonText: {
    paddingLeft: 5,
    fontSize: 12,
    color: COLORS.pureWhite
  },
  innerContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  }
});
