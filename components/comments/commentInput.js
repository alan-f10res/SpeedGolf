import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { STYLES } from "../../styles/styles";

export default class Input extends Component {
  state = {
    text: undefined // user's input
  };

  // Update state when input changes
  onChangeText = text => this.setState({ text });

  // Handle return press on the keyboard
  // NOTE: You don't really need it for this example, because
  // we're using a keyboard without return button, but I left it here
  // in case you'd want to switch to a different keyboard
  onSubmitEditing = ({ nativeEvent: { text } }) =>
    this.setState({ text }, this.submit);

  // Call this.props.onSubmit handler and pass the comment
  submit = () => {
    const { text } = this.state;
    if (text) {
      this.setState({ text: undefined }, () => this.props.onSubmit(text));
    } else {
      alert("Please enter your comment first");
    }
  };

  render() {
    return (
      // This moves children view with input field and submit button
      // up above the keyboard when it's active

      <View style={styles.container}>
        <TextInput
          autoCorrect={false}
          placeholder="Add a comment..."
          keyboardType="twitter" // keyboard with no return button
          autoFocus={true} // focus and show the keyboard
          style={styles.input}
          value={this.state.text}
          onChangeText={this.onChangeText} // handle input changes
          onSubmitEditing={this.onSubmitEditing} // handle submit event
        />
        <TouchableOpacity style={styles.button} onPress={this.submit}>
          <Text style={[styles.text, !this.state.text ? styles.inactive : []]}>
            POST
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    paddingLeft: 15
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  inactive: {
    color: "#CCC"
  },
  text: {
    color: "#3F51B5",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  }
});
