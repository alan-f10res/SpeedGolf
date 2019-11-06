import React, { Component } from "react";
import { View, Text, TextInput, TouchableHighlight } from "react-native";
import { Actions } from "react-native-router-flux";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { STYLES } from "../../styles/styles";
import { COLORS } from "../../styles/colors";
import { LoginHeader } from "./loginHeader";
import {
  refreshAppData,
  refreshCourseData,
  setCurrentUser
} from "../../state/currentUser.state";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";

export class LoginWithEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.dispatch(refreshCourseData());

    this.authListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Actions.main();
      }
    });
  };

  componentWillUnmount() {
    this.authListener();
  }

  startLoading = () => {
    this.setState({
      isLoading: true
    });
  };

  endLoading = () => {
    this.setState({
      isLoading: false
    });
  };

  loginUserFail = errorMessage => {
    this.setState({
      errorMessage: errorMessage,
      isLoading: false
    });
  };

  loginUserSuccess = async userResponse => {
    let user = userResponse.user.toJSON();

    this.setState({
      user: user,
      isLoading: false
    });
    this.props.dispatch(setCurrentUser(user));
    this.props.dispatch(refreshAppData());
    Actions.main();
  };

  login = async () => {
    this.startLoading();

    // Force user to log in
    let { email, password } = this.state;

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async user => await this.loginUserSuccess(user))
      .catch(error => this.loginUserFail(error.message));
  };

  render() {
    return (
      <KeyboardAwareScrollView
        extraHeight={40}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={STYLES.pageContainer}
      >
        {this.state.isLoading ? <LoadingOverlay /> : null}

        <View>
          <LoginHeader />
        </View>
        <View
          style={{
            flex: 4,
            paddingVertical: 20,
            paddingHorizontal: "10%"
          }}
        >
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Email:</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={STYLES.inputField}
              placeholder={"Enter Email Address"}
              placeholderTextColor={COLORS.darkGrey}
              onChangeText={text =>
                this.setState({ email: text, errorMessage: "" })
              }
            />
          </View>
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Password:</Text>
            <TextInput
              style={STYLES.inputField}
              placeholder={"Enter Password"}
              placeholderTextColor={COLORS.darkGrey}
              secureTextEntry={true}
              onChangeText={text =>
                this.setState({ password: text, errorMessage: "" })
              }
            />
          </View>
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
          <View style={STYLES.inputContainer}>
            <TouchableHighlight
              style={STYLES.button}
              underlayColor={COLORS.lightBlue}
              onPress={this.login}
            >
              <Text style={STYLES.buttonText}>Log In</Text>
            </TouchableHighlight>
          </View>

          <View
            style={[
              STYLES.inputContainer,
              { flexDirection: "row", justifyContent: "space-between" }
            ]}
          >
            <TouchableHighlight onPress={Actions.forgotPassword}>
              <Text style={{ textDecorationLine: "underline" }}>
                Forgot Password
              </Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => Actions.signUp()}>
              <Text style={{ textDecorationLine: "underline" }}>Sign Up</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state
  };
};

LoginWithEmail = connect(mapStateToProps)(LoginWithEmail);
