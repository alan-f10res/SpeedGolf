import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import { Button } from "react-native-elements";
import * as Yup from "yup";

import { COLORS } from "../../styles/colors";
import { MyTextInput } from "../settings/myTextInput";
import { MyImagePicker } from "../pickers/imagePicker";
import { createUser } from "../../api/users.api";
import { createUserAuth } from "../../api/auth.api";
import { getStore } from "../../state/dataTree";
import { setCurrentUser } from "../../state/currentUser.state";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";

export class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
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

  handleSignUp = async (values, formikBag) => {
    this.startLoading();

    let {
      email,
      password,
      firstName,
      lastName,
      username,
      profileImageURI
    } = values;

    let apiResponse = await createUserAuth(email, password);

    if (apiResponse.error) {
      let { error } = apiResponse;
      formikBag.setSubmitting(false);
      this.endLoading();
      formikBag.setFieldError("email", error.message);
    } else {
      let { user } = apiResponse;
      let { _user } = user;
      let userRecordData = {
        username,
        id: _user.uid,
        firstName,
        lastName,
        email,
        profileImageURI
      };
      await createUser(userRecordData).then(() => {
        getStore().dispatch(setCurrentUser(userRecordData));
      });
      formikBag.setSubmitting(false);
      Actions.successfulRegistration();
      this.endLoading();
    }
  };

  render() {
    return (
      <View style={styles.pageContainer}>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        <Formik
          initialValues={{
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
            profileImageURI: null
          }}
          onSubmit={this.handleSignUp}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Email is not valid")
              .required("Email is required"),
            firstName: Yup.string().required("First name is required"),
            username: Yup.string()
              .min(6, "Username must be at least 6 characters")
              .required("Username is required"),
            lastName: Yup.string().required("Last name is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password", null)], "Passwords don't match")
              .required("Passwrods must match")
          })}
          render={({
            values,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            setFieldTouched,
            isValid,
            isSubmitting
          }) => {
            return (
              <React.Fragment>
                <KeyboardAwareScrollView
                  extraScrollHeight={40}
                  keyboardShouldPersistTaps="always"
                >
                  <View>
                    <MyImagePicker
                      title={"Profile Photo (Optional)"}
                      subTitle="Click to Upload"
                      imageSource={values.profileImageURI}
                      uploadCallback={newURI => {
                        setFieldValue("profileImageURI", newURI);
                      }}
                    />
                    <View
                      style={{
                        paddingHorizontal: 10
                      }}
                    >
                      <MyTextInput
                        label="Username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.username}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="username"
                        error={touched.username && errors.username}
                      />
                      <MyTextInput
                        label="First Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.firstName}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="firstName"
                        error={touched.firstName && errors.firstName}
                      />
                      <MyTextInput
                        label="Last Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.lastName}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="lastName"
                        error={touched.lastName && errors.lastName}
                      />
                      <MyTextInput
                        label="Email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.email}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="email"
                        error={touched.email && errors.email}
                      />
                      <MyTextInput
                        label="Password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.password}
                        onTouch={setFieldTouched}
                        secureTextEntry
                        onChange={setFieldValue}
                        name="password"
                        error={touched.password && errors.password}
                      />
                      <MyTextInput
                        label="Password Confirmation"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={values.confirmPassword}
                        onTouch={setFieldTouched}
                        secureTextEntry
                        onChange={setFieldValue}
                        name="confirmPassword"
                        returnKeyType={"done"}
                        error={
                          touched.confirmPassword && errors.confirmPassword
                        }
                      />
                    </View>
                    <View style={styles.actionContainer}>
                      <Button
                        buttonStyle={styles.button}
                        backgroundColor={COLORS.blue}
                        title="Sign Up"
                        onPress={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                      />
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              </React.Fragment>
            );
          }}
        />
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
  actionContainer: {
    marginVertical: 30
  },
  button: {
    width: "100%",
    marginTop: 10
  },
  loginHeaderContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.blue,
    width: "100%",
    paddingVertical: 10
  },
  loginHeaderText: {
    color: COLORS.pureWhite,
    textAlign: "center",
    fontSize: 20
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: "5%",
    paddingTop: "5%"
  },
  primaryButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  secondaryButton: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  primaryButtonText: {
    color: COLORS.pureWhite,
    textAlign: "center",
    marginVertical: 15
  },
  secondaryButtonText: {
    color: COLORS.darkGrey,
    textAlign: "center",
    marginVertical: 15
  },
  errorMessage: {
    color: "red",
    fontSize: 10
  },
  inputContainer: {
    flex: 0,
    flexDirection: "column",
    marginVertical: 10
  },
  inputLabel: {
    fontSize: 16
  },
  inputField: {
    borderColor: "black",
    borderWidth: 1,
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: 12
  }
});

// fields for

// Account Information
// username
// email
// password
// password confirmation

// Bio
// first name
// last name
// city -> textinput
// state -> textinput
// country -> selection
// birthdate -> date picker

// profile picture -> upload screen (up top, TH style)

// Social
// connect social media -> button
