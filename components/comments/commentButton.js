import React, { Component } from "react";
import { TouchableHighlight, Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";

import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

export class CommentButton extends Component {
  clickedCommentButton = () => {
    Actions.comments({
      roundId: this.props.roundId,
      comments: this.props.comments
    });
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.touchableButton}
        onPress={this.clickedCommentButton}
      >
        <View style={styles.innerContainer}>
          <Icon name="comments" color={COLORS.blue} size={12} />
          <Text style={styles.buttonText}>
            Comments ({(this.props.comments && this.props.comments.length) || 0}
            )
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchableButton: {
    height: 30,
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 10,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    paddingLeft: 5,
    fontSize: 12
  },
  innerContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
