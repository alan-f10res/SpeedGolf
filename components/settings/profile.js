import React, { Component } from "react";
import { View, StyleSheet, Alert, Text, Keyboard } from "react-native";
import { Actions } from "react-native-router-flux";
import { Formik } from "formik";
import { Button, ButtonGroup, FormLabel } from "react-native-elements";
import * as Yup from "yup";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Picker from "react-native-picker";

import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";
import { MyTextInput } from "./myTextInput";
import {
  formatDate,
  formatSpeedGolfScore,
  makeDateData,
  makeSpeedgolfScoreData,
  makeTimeData,
  formatTimeMinutesSecondsOnly
} from "../../lib/formatters";
import { PressableInput } from "./pressableInput";
import { ClubSelector } from "./clubSelector";
import { ToggleableDistanceEntry } from "../sharedComponents/toggleableDistanceEntry";

import { MyImagePicker } from "../pickers/imagePicker";
import { CourseSelector } from "../courses/courseSelector";
import { CourseCard } from "../courses/courseCard";
import { updateUser as updateUserAPI } from "../../api/users.api";
import {
  updateCurrentUser,
  updateUserProfileImage
} from "../../state/currentUser.state";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { KeyboardTimeEntry } from "../sharedComponents/keyboardTimeEntry";

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: this.props.initialIndex || 0,
      bestCourseId: this.props.currentUser.bestCourseId,
      homeCourseId: this.props.currentUser.homeCourseId,
      clubsInBag: this.props.currentUser.clubsInBag || [],
      bestRoundRunningDistance: this.props.currentUser.bestRoundRunningDistance,
      bestRoundGolfDistance: this.props.currentUser.bestRoundGolfDistance,
      profileImageURI: this.props.currentUser.profileImageURI
    };

    this.dateData = makeDateData();
    this.timeData = makeTimeData();
    this.speedgolfScoreData = makeSpeedgolfScoreData();
  }

  handleSubmit = async (values, formikBag) => {
    let id = this.props.currentUser.id;
    let {
      bestCourseId,
      homeCourseId,
      clubsInBag,
      bestRoundRunningDistance,
      bestRoundGolfDistance,
      profileImageURI
    } = this.state;

    values = {
      ...values,
      bestCourseId,
      homeCourseId,
      bestRoundRunningDistance,
      bestRoundGolfDistance,
      clubsInBag,
      profileImageURI
    };

    const newUserImageURI =
      profileImageURI !== this.props.currentUser.profileImageURI &&
      profileImageURI;

    await updateUserAPI(id, values, newUserImageURI)
      .then(() => {
        this.props.dispatch(updateCurrentUser(values));
        formikBag.setSubmitting(false);
        Alert.alert("Success", "Profile updated successfully", [
          {
            text: "Ok",
            onPress: Actions.pop
          }
        ]);
      })
      .catch(error => {
        console.warn(error.message);
        formikBag.setErrors(error);
        formikBag.setSubmitting(false);
      });
  };

  uploadProfileImageForUser = async url => {
    // upload image to api
    // get download url from that response
    // update the user model with the updated url
    // update the store with the proper image

    this.props.dispatch(
      await updateUserProfileImage(url, this.props.currentUser.id)
    );
    Alert.alert("Profile Image Uploaded Successfully");
  };

  toggleShownSettings = index => {
    this.setState({
      selectedIndex: index
    });
  };

  launchBirthdayPicker = (values, setFieldValue) => {
    Picker.init({
      pickerData: this.dateData,
      selectedValue: values.birthday,
      pickerTitleText: "Year | Month | Date",
      onPickerConfirm: data => {
        setFieldValue("birthday", data);
      }
    });

    Picker.show();
  };

  renderProfile = () => {
    let { currentUser } = this.props;
    let {
      email,
      firstName,
      lastName,
      username,
      city,
      state,
      country,
      birthday
    } = currentUser;

    return (
      <Formik
        initialValues={{
          email: email || "",
          firstName: firstName || "",
          lastName: lastName || "",
          username: username || "",
          city: city || "",
          state: state || "",
          country: country || "",
          birthday: birthday || [2019, 1, 1]
        }}
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Email is not valid")
            .required("Email is required")
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
                {isSubmitting ? <LoadingOverlay /> : null}
                <MyImagePicker
                  title={"Profile Photo"}
                  subTitle="Click to Upload"
                  imageSource={this.state.profileImageURI}
                  uploadCallback={async newURI =>
                    this.setState({ profileImageURI: newURI })
                  }
                />
                <View style={{ paddingHorizontal: 10 }}>
                  <MyTextInput
                    label="Username"
                    autoCapitalize="none"
                    value={values.username}
                    onChange={setFieldValue}
                    onTouch={setFieldTouched}
                    name="username"
                    error={touched.username && errors.username}
                  />
                  <MyTextInput
                    label="First Name"
                    autoCapitalize="none"
                    value={values.firstName}
                    onChange={setFieldValue}
                    onTouch={setFieldTouched}
                    name="firstName"
                    error={touched.firstName && errors.firstName}
                  />
                  <MyTextInput
                    label="Last Name"
                    autoCapitalize="none"
                    value={values.lastName}
                    onChange={setFieldValue}
                    onTouch={setFieldTouched}
                    name="lastName"
                    error={touched.lastName && errors.lastName}
                  />
                  <MyTextInput
                    label="Email"
                    autoCapitalize="none"
                    value={values.email}
                    onChange={setFieldValue}
                    onTouch={setFieldTouched}
                    name="email"
                    error={touched.email && errors.email}
                  />
                  <MyTextInput
                    label="City"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={values.city}
                    onTouch={setFieldTouched}
                    onChange={setFieldValue}
                    name="city"
                    error={touched.city && errors.city}
                  />
                  <MyTextInput
                    label="State / Province"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={values.state}
                    onTouch={setFieldTouched}
                    onChange={setFieldValue}
                    name="state"
                    error={touched.state && errors.state}
                  />
                  <MyTextInput
                    label="Country"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={values.country}
                    onTouch={setFieldTouched}
                    onChange={setFieldValue}
                    name="country"
                    error={touched.country && errors.country}
                  />
                  <PressableInput
                    onPress={() => {
                      this.launchBirthdayPicker(values, setFieldValue);
                    }}
                    label="Birthday"
                    value={formatDate(values.birthday)}
                    name="birthday"
                  />
                  <View
                    style={{
                      paddingVertical: 10
                    }}
                  >
                    <Button
                      color={COLORS.pureWhite}
                      buttonStyle={{
                        backgroundColor: COLORS.blue
                      }}
                      backgroundColor={COLORS.blue}
                      title={"Reset Password"}
                      onPress={() =>
                        Alert.alert(
                          "Reset Password",
                          `A link has been sent to ${values.emaail ||
                            "your email"} with password reeset instructions`,
                          [
                            {
                              text: "OK"
                            }
                          ],
                          { cancelable: true }
                        )
                      }
                    />
                  </View>
                  <Button
                    buttonStyle={styles.button}
                    backgroundColor={COLORS.blue}
                    title="Save Changes"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  />
                </View>
              </KeyboardAwareScrollView>
            </React.Fragment>
          );
        }}
      />
    );
  };

  getSpeedgolfStrokesFromScore = values => {
    return (
      values.bestSpeedgolfScore[0] && values.bestSpeedgolfScore[0].toString()
    );
  };

  launchFirstDatePicker = (values, setFieldValue) => {
    Picker.init({
      pickerData: this.dateData,
      selectedValue: values.firstRoundDate,
      pickerTitleText: "Year | Month | Date",
      onPickerConfirm: data => {
        setFieldValue("firstRoundDate", data);
      }
    });

    Picker.show();
  };

  launchScorePicker = (values, setFieldValue) => {
    Picker.init({
      pickerData: this.speedgolfScoreData,
      selectedValue: values.bestSpeedgolfScore,
      pickerTitleText: "Strokes |  Minutes | Seconds",
      onPickerConfirm: data => {
        setFieldValue("bestSpeedgolfScore", data);
      }
    });

    Picker.show();
  };

  launchDetailCard = courseId => {
    Actions.courseDetailCard({
      id: courseId
    });
  };

  getBestCourseSection = () => {
    if (this.state.bestCourseId) {
      return (
        <CourseCard
          id={this.state.bestCourseId}
          hideButtons={true}
          onSelectCallback={() => {
            this.launchDetailCard(this.state.bestCourseId);
          }}
          onClearCallback={() => {
            this.setState({
              bestCourseId: null
            });
          }}
        />
      );
    } else {
      return (
        <CourseSelector
          styleOverride={{
            backgroundColor: COLORS.lightGrey
          }}
          value={"Select Best Course"}
          onSelectCallback={courseId => {
            this.setState({
              bestCourseId: courseId
            });
          }}
          name="bestCourseId"
        />
      );
    }
  };

  getHomeCourseSection = () => {
    if (this.state.homeCourseId) {
      return (
        <CourseCard
          hideButtons={true}
          key={this.state.homeCourseId}
          id={this.state.homeCourseId}
          onSelectCallback={() => {
            this.launchDetailCard(this.state.homeCourseId);
          }}
          onClearCallback={() => {
            this.setState({
              homeCourseId: null
            });
          }}
        />
      );
    } else {
      return (
        <CourseSelector
          styleOverride={{
            backgroundColor: COLORS.lightGrey
          }}
          value={"Select a Home Course"}
          onSelectCallback={courseId => {
            this.setState({
              homeCourseId: courseId
            });
          }}
          name="homeCourseId"
        />
      );
    }
  };

  renderGolfSettings = () => {
    let { currentUser } = this.props;
    let {
      handicap,
      firstRoundDate,
      fiveKTime,
      bestSpeedgolfScore,
      speedGolfHandicap
    } = currentUser;

    let initialValueOfFirstPlayedRound = ["72", "55", "00"];
    let initialFiveKTime = [null, null];
    let initialSpeedgolfScore = ["72", "55", "00"];

    return (
      <View style={STYLES.pageContainer}>
        <View
          style={{
            paddingHorizontal: 10
          }}
        >
          <Formik
            initialValues={{
              handicap: handicap || "",
              firstRoundDate: firstRoundDate || initialValueOfFirstPlayedRound,
              fiveKTime: fiveKTime || initialFiveKTime,
              bestSpeedgolfScore: bestSpeedgolfScore || initialSpeedgolfScore,
              speedGolfHandicap: speedGolfHandicap || ""
            }}
            onSubmit={this.handleSubmit}
            validationSchema={Yup.object().shape({
              handicap: Yup.number()
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
                      {isSubmitting ? <LoadingOverlay /> : null}
                      <View>
                        <FormLabel labelStyle={STYLES.formLabel}>
                          Home Course
                        </FormLabel>
                        {this.getHomeCourseSection()}
                      </View>
                      <MyTextInput
                        label="Golf Handicap"
                        keyboardType="decimal-pad"
                        value={values.handicap.toString()}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="handicap"
                        error={touched.handicap && errors.handicap}
                      />
                      <View>
                        <FormLabel labelStyle={STYLES.formLabel}>
                          Current 5K Time
                        </FormLabel>
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "row",
                            borderBottomColor: "black",
                            borderBottomWidth: 1,
                            height: 36
                          }}
                        >
                          <KeyboardTimeEntry
                            placeholder={"Current 5k Time"}
                            style={{
                              color: COLORS.blue,
                              fontSize: 18,
                              flex: 1
                            }}
                            value={values.fiveKTime}
                            onSubmitEditing={({ displayTime }) => {
                              setFieldValue("fiveKTime", displayTime);
                              Keyboard.dismiss();
                            }}
                            onBlur={({ displayTime }) => {
                              setFieldValue("fiveKTime", displayTime);
                              Keyboard.dismiss();
                            }}
                          />
                        </View>
                      </View>

                      <MyTextInput
                        label="SpeedGolf Handicap"
                        editable={false}
                        keyboardType="decimal-pad"
                        value={values.speedGolfHandicap.toString()}
                        onChange={setFieldValue}
                        onTouch={setFieldTouched}
                        name="speedGolfHandicap"
                        error={
                          touched.speedGolfHandicap && errors.speedGolfHandicap
                        }
                      />
                      <ClubSelector
                        clubsInBag={this.state.clubsInBag}
                        onChangeClubs={newClubs => {
                          this.setState({
                            clubsInBag: newClubs
                          });
                        }}
                      />
                      <PressableInput
                        onPress={() => {
                          this.launchFirstDatePicker(values, setFieldValue);
                        }}
                        label="First Speedgolf Round"
                        value={formatDate(values.firstRoundDate)}
                        name="firstRoundDate"
                      />
                      <View
                        style={{
                          marginVertical: 10,
                          paddingBottom: 5,
                          backgroundColor: COLORS.lightGrey,
                          borderColor: COLORS.mediumGrey,
                          borderWidth: 1,
                          borderRadius: 5,
                          paddingHorizontal: 10
                        }}
                      >
                        <FormLabel labelStyle={STYLES.formLabel}>
                          BEST SPEEDGOLF ROUND
                        </FormLabel>
                        <View
                          style={{
                            marginTop: 10
                          }}
                        >
                          <FormLabel labelStyle={STYLES.formLabel}>
                            Course
                          </FormLabel>
                          {this.getBestCourseSection()}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: 30,
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <PressableInput
                            styleOverride={{
                              maxWidth: 100,
                              paddingHorizontal: 5
                            }}
                            onPress={() => {
                              this.launchScorePicker(values, setFieldValue);
                            }}
                            label="Score"
                            editable={false}
                            value={formatSpeedGolfScore(
                              values.bestSpeedgolfScore
                            )}
                            name="bestSpeedgolfScore"
                          />
                          <PressableInput
                            styleOverride={{
                              maxWidth: 100,
                              paddingHorizontal: 5
                            }}
                            onPress={() => {
                              this.launchScorePicker(values, setFieldValue);
                            }}
                            label="Strokes"
                            value={this.getSpeedgolfStrokesFromScore(values)}
                            name="bestRoundStrokes"
                          />
                          <PressableInput
                            styleOverride={{
                              maxWidth: 100,
                              paddingHorizontal: 5
                            }}
                            onPress={() => {
                              this.launchScorePicker(values, setFieldValue);
                            }}
                            label="Time"
                            value={formatTimeMinutesSecondsOnly([
                              values.bestSpeedgolfScore[1],
                              values.bestSpeedgolfScore[2]
                            ])}
                            name="bestRoundTime"
                          />
                        </View>
                        <View>
                          <ToggleableDistanceEntry
                            label="Running Distance"
                            typeOfDistance="running"
                            onUpdate={newValue => {
                              this.setState({
                                bestRoundRunningDistance: newValue
                              });
                            }}
                            initialValue={this.state.bestRoundRunningDistance}
                          />
                          <ToggleableDistanceEntry
                            label="Golf Distance"
                            typeOfDistance="distance"
                            onUpdate={newValue => {
                              this.setState({
                                bestRoundGolfDistance: newValue
                              });
                            }}
                            initialValue={this.state.bestRoundGolfDistance}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.actionContainer}>
                      <Button
                        buttonStyle={styles.button}
                        backgroundColor={COLORS.blue}
                        title="Save Changes"
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                      />
                    </View>
                  </KeyboardAwareScrollView>
                </React.Fragment>
              );
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    const { selectedIndex } = this.state;
    return (
      <View
        style={[STYLES.pageContainer, { backgroundColor: COLORS.pureWhite }]}
      >
        <ButtonGroup
          selectedIndex={selectedIndex}
          onPress={index => this.toggleShownSettings(index)}
          buttons={["User Profile", "Speedgolf Profile"]}
          selectedButtonStyle={{ backgroundColor: COLORS.blue }}
          selectedTextStyle={{ color: COLORS.lightGrey, fontWeight: "bold" }}
        />
        {selectedIndex === 0 ? this.renderProfile() : this.renderGolfSettings()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
    courseLookup: state.golfCourseLookup
  };
};

Profile = connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: COLORS.pureWhite,
    width: "90%",
    alignSelf: "center"
  },

  actionContainer: {
    marginVertical: 30,
    flex: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginTop: 10,
    width: "100%"
  },
  pickerStyle: {
    height: 300,
    position: "absolute",
    bottom: 0
  }
});
