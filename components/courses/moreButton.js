import React, { Component } from "react";
import {
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../../styles/colors";

export class MoreButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight style={styles.touchableButton} onPress={() => {
        this.props.moreCallback && this.props.moreCallback()
      }}>
        <View style={styles.innerContainer}>
          <Icon name="chevron-down" color={COLORS.pureWhite} size={12} />
          <Text style={styles.buttonText}>More</Text>
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
    margin: 2
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
