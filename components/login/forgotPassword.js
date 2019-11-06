import React, { Component } from "react";
import {
  View,
  Alert,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import firebase from "react-native-firebase";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";
import { Actions } from "react-native-router-flux";

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ""
    };
  }

  pressSubmit = async () => {
    Alert.alert(
      "Password Reset",
      "Please check your email for instructions on how to reset your password",
      [
        {
          text: "Ok",
          onPress: async () => await this.sendResetPasswordEmail()
        }
      ],
      { cancelable: true }
    );
  };

  sendResetPasswordEmail = async () => {
    let { email } = this.state;
    if (email) {
      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
        })
        .catch(error => {
        });
    }
  };
  render() {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.formContainer}>
          <Text>
            Please enter your email address below to reset your password
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.inputField}
              placeholder={"Enter Email Address"}
              placeholderTextColor={COLORS.darkGrey}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableHighlight
              style={styles.button}
              underlayColor={COLORS.lightBlue}
              onPress={this.pressSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: COLORS.pureWhite
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: "10%",
    paddingVertical: "10%"
  },
  inputContainer: {
    flex: 0,
    flexDirection: "column",
    marginVertical: 10
  },
  inputLabel: {
    fontSize: 24
  },
  inputField: {
    borderColor: "black",
    borderWidth: 1,
    fontSize: 18,
    paddingVertical: 6,
    paddingHorizontal: 6
  },
  button: {
    backgroundColor: COLORS.blue,
    borderRadius: 5
  },
  buttonText: {
    color: COLORS.pureWhite,
    textAlign: "center",
    fontSize: 36,
    marginVertical: 15
  }
});
