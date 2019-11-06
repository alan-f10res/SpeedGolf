import React, { Component } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../../styles/colors";

export class FloatingActionButton extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.fabCallback}
        style={styles.floatingActionButton}
      >
        <Icon name={this.props.iconName} size={25} color={COLORS.pureWhite} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  floatingActionButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    backgroundColor: COLORS.blue,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  }
});
