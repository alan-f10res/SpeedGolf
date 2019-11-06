import React, { Component } from "react";
import { Alert } from "react-native";
import { SocialIcon } from "react-native-elements";
import { Actions } from "react-native-router-flux";

export class LoginWithFacebook extends Component {
  constructor(props) {
    super(props);
  }

  loginWithFacebook = () => {
    return Alert.alert(
      "Login",
      "Clicked Login With Facebook",
      [
        {
          text: "OK",
          onPress: () => {
            Actions.homeStack();
          }
        }
      ],
      { cancelable: true }
    );
  };

  temporaryStub = () => {
    return Alert.alert("Facebook Login Under Development...");
  };

  render() {
    return (
      <SocialIcon
        title="Sign In With Facebook"
        button
        type="facebook"
        light
        onPress={this.temporaryStub}
      />
    );
  }
}
