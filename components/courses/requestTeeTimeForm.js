import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Alert
} from "react-native";
import { connect } from "react-redux";
import Picker from "react-native-picker";
import { Actions } from "react-native-router-flux";

import { COLORS } from "../../styles/colors";
import { PressableInput } from "../settings/pressableInput";
import {
  formatDate,
  formatTimeMinutesSecondsOnly,
  makeDateData,
  makeTimeOfDayData,
  getTomorrow
} from "../../lib/formatters";
import { MyTextInput } from "../settings/myTextInput";

export class RequestTeeTimeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateData: makeDateData(2019),
      dateRequested: getTomorrow(),
      timeData: makeTimeOfDayData(),
      timeRequested: ["6", "00", "AM"],
      courseEmail: this.props.golfProperty.email
    };
  }

  launchPicker = (
    pickerData,
    selectedValue,
    pickerTitleText,
    onPickerConfirm
  ) => {
    Picker.init({
      pickerData,
      selectedValue,
      pickerTitleText,
      onPickerConfirm,
      pickerTextEllipsisLen: 100
    });

    Picker.show();
  };

  getTimeDisplayValue = () => {
    if (this.state.timeRequested && this.state.timeRequested[0]) {
      return `${formatTimeMinutesSecondsOnly(this.state.timeRequested)} ${
        this.state.timeRequested[2]
      }`;
    } else {
      return null;
    }
  };

  getDateDisplayValue = () => {
    if (this.state.dateRequested && this.state.dateRequested[0]) {
      return formatDate(this.state.dateRequested);
    } else {
      return null;
    }
  };

  submitForm = () => {
    if (!this.state.courseEmail) {
      Alert.alert(
        "Error",
        "Sorry, we don't have an email address on file for this course. Would you like to suggest one?",
        [
          {
            text: "Cancel"
          },
          {
            text: "Ok"
          }
        ]
      );
    } else {
      Alert.alert(
        "Submitted Request",
        "An email has been sent on your behalf.",
        [
          {
            text: "Ok",
            onPress: Actions.pop
          }
        ]
      );
    }
  };

  render() {
    return (
      <View
        style={{
          padding: 20
        }}
      >
        <View
          style={{
            paddingVertical: 10
          }}
        >
          <Text
            style={{
              fontSize: 20
            }}
          >
            Request tee time for:
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold"
            }}
          >
            {this.props.golfProperty.propertyName} -{" "}
            {this.props.golfCourse.courseName}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 10
          }}
        >
          <PressableInput
            label="Date Requested"
            value={this.getDateDisplayValue()}
            onPress={() => {
              this.launchPicker(
                this.state.dateData,
                this.state.dateRequested,
                "Year | Month | Day",
                data => {
                  this.setState({
                    dateRequested: data
                  });
                }
              );
            }}
          />
        </View>
        <View
          style={{
            paddingVertical: 10
          }}
        >
          <PressableInput
            label="Time Requested"
            value={this.getTimeDisplayValue()}
            onPress={() => {
              this.launchPicker(
                this.state.timeData,
                this.state.timeRequested,
                "Hour | Minute | AM / PM",
                data => {
                  this.setState({
                    timeRequested: data
                  });
                }
              );
            }}
          />
        </View>
        {!this.props.golfProperty.email ? (
          <View
            style={{
              paddingVertical: 10
            }}
          >
            <MyTextInput
              label={"Contact Email"}
              onChange={(fieldName, newVal ) => {
                this.setState({
                  courseEmail: newVal
                });
              }}
              keyboardType="email-address"
            />
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <TouchableHighlight
            onPress={Actions.pop}
            style={styles.touchableButton}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.submitForm}
            style={styles.touchableButton}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchableButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    flex: 0,
    margin: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: COLORS.pureWhite,
    textAlign: "center"
  },
  innerContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  }
});

const mapStateToProps = (state, ownProps) => {
  let golfCourse = state.golfCourseLookup[ownProps.courseId];
  let golfProperty = state.golfPropertiesLookup[golfCourse.golfPropertyId];

  return {
    id: ownProps.id,
    golfCourse,
    golfProperty
  };
};

RequestTeeTimeForm = connect(mapStateToProps)(RequestTeeTimeForm);
