import React, { Component } from "react";
import firebase from "react-native-firebase";
import { SocialIcon } from "react-native-elements";
import { GoogleSignin, statusCodes } from "react-native-google-signin";

export class LoginWithGoogle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSigninInProgress: false
    };
  }

  signInWithGoogle = async () => {
    this.setState({
      isSigninInProgress: true
    });

    try {
      // add any configuration settings here:
      await GoogleSignin.configure({
        scopes: ["email", "profile"],
        webClientId:
          "631555943162-b438bngfn50b0j334bv5v9fubuusg0h4.apps.googleusercontent.com"
      });

      try {
        const data = await GoogleSignin.signIn();
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken
        );

        await firebase
          .auth()
          .signInWithCredential(credential)
          .then(async user => await this.props.loginUserSuccess(user))
          .catch(error => this.props.loginUserFail(error));
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          // console.log("error 1: ", error);
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
          // console.log("error 2: ", error);
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          // console.log("error 3: ", error);
        } else {
          // some other error happened
          // console.log("error 4: ", error);
        }
      }
    } catch (e) {
      // console.log("error 5: ", e);
    }

    this.setState({
      isSigninInProgress: false
    });
  };

  render() {
    return (
      <SocialIcon
        title="Sign In With Google"
        button
        type="google-plus-official"
        light
        onPress={this.signInWithGoogle}
        disabled={this.state.isSigninInProgress}
      />
    );
  }
}
