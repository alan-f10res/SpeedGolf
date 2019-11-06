import React, { Component } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormInput, FormLabel, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";

import { STYLES } from "../../styles/styles";
import { COLORS } from "../../styles/colors";
import { ParEntryForm } from "./parEntryForm";
import { MyImagePicker } from "../pickers/imagePicker";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";

import { saveNewGolfPropertyAPI } from "../../api/golfProperties.api";
import { saveNewCourseAPI } from "../../api/golfCourses.api";
import { GolfPropertySelector } from "./golfPropertySelector";
import { SimpleCourseSelector } from "./simpleCoursePicker";
import { saveNewTeeSetAPI } from "../../api/teeSet.api";
import {
  refreshAppData,
  refreshCourseData
} from "../../state/currentUser.state";
import { uploadCourseImage } from "../../api/images.api";

export class SuggestACourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: null,

      golfProperty: null,
      golfCourse: null,

      newGolfPropertyName: "",
      newGolfPropertyLocation: "",

      newCourseName: "",

      showMore: false,
      isLoading: false,

      teeSetName: "",
      holePars: {
        1: { strokePar: null, timePar: null, distance: null },
        2: { strokePar: null, timePar: null, distance: null },
        3: { strokePar: null, timePar: null, distance: null },
        4: { strokePar: null, timePar: null, distance: null },
        5: { strokePar: null, timePar: null, distance: null },
        6: { strokePar: null, timePar: null, distance: null },
        7: { strokePar: null, timePar: null, distance: null },
        8: { strokePar: null, timePar: null, distance: null },
        9: { strokePar: null, timePar: null, distance: null },
        10: { strokePar: null, timePar: null, distance: null },
        11: { strokePar: null, timePar: null, distance: null },
        12: { strokePar: null, timePar: null, distance: null },
        13: { strokePar: null, timePar: null, distance: null },
        14: { strokePar: null, timePar: null, distance: null },
        15: { strokePar: null, timePar: null, distance: null },
        16: { strokePar: null, timePar: null, distance: null },
        17: { strokePar: null, timePar: null, distance: null },
        18: { strokePar: null, timePar: null, distance: null }
      }
    };
  }

  updateHolePars = (hole, strokePar, timePar) => {
    this.setState({
      holePars: {
        ...this.state.holePars,
        [hole]: {
          strokePar,
          timePar
        }
      }
    });
  };

  updateTeeSetName = newTeeName => {
    this.setState({
      teeSetName: newTeeName
    });
  };

  isNewGolfProperty = () => {
    return this.state.golfProperty && this.state.golfProperty.id === 0;
  };

  isNewGolfCourse = () => {
    return this.state.golfCourse && this.state.golfCourse.id === 0;
  };

  isFormReadyForSubmission = () => {
    return true;
  };

  saveNewProperty = async () => {
    // save a new golf property and return the id
    const { newGolfPropertyName, newGolfPropertyLocation } = this.state;

    const golfPropertyData = {
      propertyName: newGolfPropertyName,
      fullAddress: newGolfPropertyLocation
    };

    return await saveNewGolfPropertyAPI(golfPropertyData);
  };

  saveNewCourse = async golfPropertyId => {
    const { imageUrl, newCourseName } = this.state;

    const courseData = {
      imageUrl,
      courseName: newCourseName,
      golfPropertyId
    };
    return await saveNewCourseAPI(courseData);
  };

  saveNewTeeSet = async golfCourseId => {
    const { teeSetName, holePars } = this.state;

    const teeSetData = {
      golfCourseId,
      teeSetName,
      holePars
    };

    return await saveNewTeeSetAPI(teeSetData);
  };

  submitCourseSuggestion = async () => {
    this.startLoading();

    let finalGolfPropertyId = null;

    let isNewProperty = this.isNewGolfProperty();
    let isNewCourse = this.isNewGolfCourse();
    let isNewTeeSet = true;

    // Since a new property cannot have an existing course,
    // and since all tee sets must be new,
    // only three possibilities, outlined here:

    if (isNewProperty && isNewCourse && isNewTeeSet) {
      // N, N, N
      // save all, one by one, and pass down id each time
      await this.saveNewProperty().then(async newPropertyId => {
        await this.saveNewCourse(newPropertyId).then(async newCourseId => {
          finalGolfPropertyId = newCourseId;

          if (this.state.imageUrl) {
            await uploadCourseImage(this.state.imageUrl, newCourseId);
          }

          await this.saveNewTeeSet(newCourseId);
        });
      });
    } else if (!isNewProperty && isNewCourse && isNewTeeSet) {
      // E, N, N
      const { golfProperty } = this.state;
      const golfPropertyId = golfProperty.id;

      // save course, pass id to new tee set
      await this.saveNewCourse(golfPropertyId).then(async newCourseId => {
        finalGolfPropertyId = newCourseId;
        if (this.state.imageUrl) {
          await uploadCourseImage(this.state.imageUrl, newCourseId);
        }
        await this.saveNewTeeSet(newCourseId);
      });
    } else if (!isNewProperty && !isNewCourse && isNewTeeSet) {
      // E, E, N
      // only save new tee set
      const { golfCourse } = this.state;
      const golfCourseId = golfCourse.id;
      finalGolfPropertyId = golfCourseId;
      await this.saveNewTeeSet(golfCourseId);
    }
    this.showSuccessModal(finalGolfPropertyId);
  };

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

  showErrorModal = () => {
    Alert.alert(
      "Whoops",
      "Something went wrong. Please try again, or contact our support team.",
      { cancelable: true }
    );
  };

  showSuccessModal = finalGolfPropertyId => {
    Alert.alert(
      "Success",
      "Your course suggestion has been submitted. It must be approved by our admins before displaying in the courses directory, but you can use it immediately.",
      [
        {
          text: "OK",
          onPress: () => {
            this.props.dispatch(refreshCourseData());
            setTimeout(() => {
              this.endLoading();
              this.props.submitCallback &&
                this.props.submitCallback(finalGolfPropertyId);
              Actions.pop();
            }, 2000);
          }
        }
      ],
      { cancelable: true }
    );
  };

  cancelSuggestion = () => {
    Alert.alert(
      "Warning",
      "If you go back now, your progress will not be saved. Are you sure you want to go back?",
      [
        { text: "Cancel", onPress: () => {} },
        { text: "OK", onPress: () => Actions.pop() }
      ],
      { cancelable: true }
    );
  };

  toggleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore
    });
  };

  getPropertySection = () => {
    let { golfProperty } = this.state;

    if (!golfProperty) {
      // case 1: nothing selected -> show picker
      return (
        <GolfPropertySelector
          styleOverride={{
            marginHorizontal: 20
          }}
          value={this.state.golfProperty}
          selectCallback={newValue => {
            this.setState({
              golfProperty: newValue
            });
          }}
        />
      );
    } else if (golfProperty.id === 0) {
      // case 2: other selected -> show editable fields
      // name (required)
      // location (required)
      return (
        <View>
          <View>
            <FormInput
              editable={false}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              value={"Other:"}
            />
            <FormInput
              value={this.state.newGolfPropertyName}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              placeholder={"Property Name (required)"}
              onChangeText={newValue => {
                this.setState({
                  newGolfPropertyName: newValue
                });
              }}
              autoCorrect={false}
              autoCapitalize={"words"}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 20,
                top: 10
              }}
              onPress={() => {
                this.setState({
                  golfProperty: null,
                  golfCourse: null
                });
              }}
            >
              <Icon name="close" color={COLORS.blue} size={20} />
            </TouchableOpacity>
          </View>
          <View>
            <FormLabel labelStyle={STYLES.formLabel}>Location*</FormLabel>
            <FormInput
              placeholder={"Course Location (required)"}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              onChangeText={newText => {
                this.setState({
                  newGolfPropertyLocation: newText
                });
              }}
              autoCorrect={false}
              autoCapitalize={"words"}
            />
          </View>
        </View>
      );
    } else {
      // case 3: existing course selected -> show non-editable, populated fields
      return (
        <View>
          <View>
            <FormInput
              editable={false}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              value={this.state.golfProperty.propertyName}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 20,
                top: 10
              }}
              onPress={() => {
                this.setState({
                  golfProperty: null
                });
              }}
            >
              <Icon name="close" color={COLORS.blue} size={20} />
            </TouchableOpacity>
          </View>
          <View>
            <FormLabel labelStyle={STYLES.formLabel}>Location</FormLabel>
            <FormInput
              editable={false}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              value={this.state.golfProperty.fullAddress}
            />
          </View>
        </View>
      );
    }
  };

  displayEditableCourseFields = () => {
    return (
      <View>
        <FormLabel labelStyle={STYLES.formLabel}>Course Name*</FormLabel>
        <FormInput
          inputStyle={{
            color: COLORS.blue
          }}
          containerStyle={{
            borderBottomColor: COLORS.blue
          }}
          placeholder={"Course Name"}
          value={this.state.newCourseName}
          onChangeText={newValue => {
            this.setState({
              newCourseName: newValue
            });
          }}
          autoCorrect={false}
          autoCapitalize={"words"}
        />
      </View>
    );
  };

  retrieveCoursesForProperty = () => {
    let { golfCourseList } = this.props;
    let coursesOut = [];
    let { golfProperty } = this.state;

    golfCourseList.forEach(courseObject => {
      if (courseObject.golfPropertyId === golfProperty.id) {
        coursesOut.push(courseObject);
      }
    });

    return coursesOut;
  };

  getCourseSection = () => {
    let { golfProperty, golfCourse } = this.state;
    if (!golfProperty) {
      // case 1: property = null -> hide this section
      return null;
    } else {
      // cases 2 thru 4: property is not null
      if (!golfCourse) {
        // case 2: course is null
        let existingCourses = this.retrieveCoursesForProperty();
        if (existingCourses) {
          // case 2a: there is at least one existing courses for property -> show SIMPLE course picker
          return (
            <View>
              <FormLabel labelStyle={STYLES.formLabel}>Golf Course*</FormLabel>
              <SimpleCourseSelector
                styleOverride={{
                  marginHorizontal: 20
                }}
                value={this.state.golfCourse}
                golfPropertyCourseList={existingCourses}
                selectCallback={newValue => {
                  this.setState({
                    golfCourse: newValue
                  });
                }}
              />
            </View>
          );
        } else {
          // case 2b: there are no existing courses for property -> go right into showing editable fields
          return this.displayEditableCourseFields();
        }
      } else if (golfCourse.id === 0) {
        // case 3: course is other -> show editable fields
        return this.displayEditableCourseFields();
      } else {
        // case 4: course is selected -> show non-editable, populated fields
        return (
          <View>
            <FormLabel labelStyle={STYLES.formLabel}>Golf Course*</FormLabel>
            <FormInput
              editable={false}
              inputStyle={{
                color: COLORS.blue
              }}
              containerStyle={{
                borderBottomColor: COLORS.blue
              }}
              value={this.state.golfCourse.courseName}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 20,
                top: 40
              }}
              onPress={() => {
                this.setState({
                  golfCourse: null
                });
              }}
            >
              <Icon name="close" color={COLORS.blue} size={20} />
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  render() {
    return (
      <View style={[STYLES.pageContainer, { backgroundColor: "white" }]}>
        <KeyboardAwareScrollView
          extraScrollHeight={40}
          keyboardShouldPersistTaps="always"
        >
          <View style={{ maxHeight: 250 }}>
            <MyImagePicker
              title={"Course Photo (Optional, click to upload)"}
              icon={"plus"}
              imageSource={this.state.imageUrl}
              uploadCallback={newImageURI => {
                this.setState({
                  imageUrl: newImageURI
                });
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 10
            }}
          >
            <View>
              <FormLabel labelStyle={STYLES.formLabel}>
                Golf Property*
              </FormLabel>
              {this.getPropertySection()}
            </View>
            <View>{this.getCourseSection()}</View>
            <View>
              {this.state.showMore ? (
                <View>
                  <ParEntryForm
                    updateHolePars={this.updateHolePars}
                    updateTeeSetName={this.updateTeeSetName}
                    holePars={this.state.holePars}
                  />
                </View>
              ) : null}
              <Button
                style={styles.button}
                title={`${this.state.showMore ? "Hide" : "Enter"} Tee Info`}
                onPress={this.toggleShowMore}
              />
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Button
              style={styles.button}
              title="Cancel"
              onPress={this.cancelSuggestion}
            />
            <Button
              backgroundColor={COLORS.blue}
              style={styles.button}
              title="Submit"
              onPress={this.submitCourseSuggestion}
              disabled={!this.isFormReadyForSubmission()}
            />
          </View>
        </KeyboardAwareScrollView>
        {this.state.isLoading ? <LoadingOverlay /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionContainer: {
    marginVertical: 30,
    flex: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between"
  },
  button: {
    marginTop: 10,
    minWidth: "40%"
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    golfCourseList: state.golfCourseList
  };
};

SuggestACourse = connect(mapStateToProps)(SuggestACourse);
