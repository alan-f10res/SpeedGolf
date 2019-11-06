import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import Video from "react-native-video";
import { Button } from "react-native-elements";

import GolfVideo from "../../images/SGAppLogin.mp4";
import { STYLES } from "../../styles/styles";
import { COLORS } from "../../styles/colors";
import { LoginWithGoogle } from "./loginWithGoogle";
import {
  refreshAppData,
  refreshCourseData,
  setCurrentUser
} from "../../state/currentUser.state";

import pkg from "../../package.json";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { LoginWithFacebook } from "./loginWithFacebook";
import { LoginHeader } from "./loginHeader";

export class Login extends Component {
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

  render() {
    return (
      <View style={STYLES.pageContainer}>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        <StatusBar barStyle="light-content" />
        <Video
          repeat
          source={GolfVideo}
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          ref={ref => {
            this.player = ref;
          }}
        />

        <LoginHeader />
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <LoginWithGoogle
            loginUserFail={this.loginUserFail}
            loginUserSuccess={this.loginUserSuccess}
          />
          <LoginWithFacebook />

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: "10%"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10
              }}
            >
              <View
                style={{
                  width: "40%",
                  height: 1,
                  backgroundColor: COLORS.mediumGrey
                }}
              />
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: COLORS.mediumGrey
                  }}
                >
                  OR
                </Text>
              </View>
              <View
                style={{
                  width: "40%",
                  height: 1,
                  backgroundColor: COLORS.mediumGrey
                }}
              />
            </View>
            <Button
              title={"Sign In With Email"}
              borderRadius={10}
              onPress={() => Actions.loginWithEmail()}
            />
            <Text
              style={{
                textAlign: "center",
                color: COLORS.mediumGrey
              }}
            >
              Version Number: {pkg.version}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state
  };
};

Login = connect(mapStateToProps)(Login);
