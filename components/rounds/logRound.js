import React, { Component } from "react";
import { View, TextInput, Modal, Alert, Text, Keyboard } from "react-native";
import { connect } from "react-redux";
import Picker from "react-native-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, ButtonGroup, FormLabel } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { createRound, updateRound } from "../../api/rounds.api";
import { PressableInput } from "../settings/pressableInput";
import { STYLES } from "../../styles/styles";
import {
  formatTimeMinutesSecondsOnly,
  formatSpeedGolfScore,
  formatDate,
  getTodayArray
} from "../../lib/formatters";
import { MyTextInput } from "../settings/myTextInput";
import { COLORS } from "../../styles/colors";
import { ScoreCard } from "./scorecard/scoreCard";
import { MyImagePicker } from "../pickers/imagePicker";
import { CourseSelector } from "../courses/courseSelector";
import { CourseCard } from "../courses/courseCard";
import { blankScores } from "../sharedComponents/blankScores";
import { roundTypeOptions, dateData } from "../pickers/pickerOptions";
import { AdditionalRoundInformation } from "./logAdditionalInformation";
import { loadRounds } from "../../state/rounds.state";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { KeyboardTimeEntry } from "../sharedComponents/keyboardTimeEntry";

const SCORE_CARD_TYPES = {
  RECORD_SUMMARY_ONLY: 0,
  RECORD_EACH_HOLE: 1
};
export class LogRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHoleIndex: null,
      selectedCourse: null,
      roundComment: null,
      scores: blankScores,
      scoreCardType: SCORE_CARD_TYPES.RECORD_SUMMARY_ONLY,
      totalStrokes: 72,
      totalMinutes: 0,
      totalSeconds: 0,
      showAdditionalInfoModal: false,
      datePlayed: getTodayArray(),
      isSubmitting: false,
      teeListData: []
    };
  }

  componentDidMount() {
    if (this.props.roundId) {
      this.setState({
        isSubmitting: true
      });

      let round = this.props.roundLookup[this.props.roundId];
      if (round) {
        this.setState({
          roundId: this.props.roundId,
          selectedCourse: this.props.golfCourseLookup[round.golfCourseId],
          imageUrl: round.imageUrl,
          roundComment: round.roundComment,
          scoreCardType: round.scoreCardType,
          speedgolfScore: round.speedgolfScore,
          totalMinutes: round.totalMinutes,
          totalSeconds: round.totalSeconds,
          totalStrokes: round.totalStrokes,
          totalTime: round.totalTime,
          datePlayed: round.datePlayed,
          roundType: round.roundType,
          isSubmitting: false,
          scores: round.scores ? round.scores : this.state.scores
        });
      }
    }
  }

  // type can be 'strokes' or 'time'
  setRef = (hole, type) => {
    let refString = `input-${hole}-${type}-ref`;
    let that = this;
    return input => (that[refString] = input);
  };

  advanceToTimeCell = currentHole => {
    // console.log("calling advanceToTimeCell ", currentHole);
    currentHole = parseInt(currentHole);
    let nextHoleString = `input-${currentHole}-time-ref`;
    if (this[nextHoleString]) {
      // console.log("found next hole string ", nextHoleString);
      this[nextHoleString].focus();
    }
  };

  advanceHole = currentHole => {
    currentHole = parseInt(currentHole);
    let nextHoleNumber = currentHole !== 18 ? currentHole + 1 : 1;
    let nextHoleString = `input-${nextHoleNumber}-strokes-ref`;
    if (this[nextHoleString]) {
      this[nextHoleString].focus();
    }
  };

  submitRound = async () => {
    this.setState({
      isSubmitting: true
    });

    let isValid = this.checkDataAndInformUserOfIssues();

    if (!isValid) {
      this.setState({
        isSubmitting: false
      });
      return;
    }

    let {
      imageUrl,
      selectedCourse,
      roundComment,
      totalStrokes,
      totalMinutes,
      totalSeconds,
      scores,
      scoreCardType,
      roundType,
      datePlayed,
      selectedTeeSet,
      roundId
    } = this.state;

    let totalTime = formatTimeMinutesSecondsOnly([totalMinutes, totalSeconds]);
    let speedgolfScore = formatSpeedGolfScore([
      totalStrokes,
      totalMinutes,
      totalSeconds
    ]);

    let userId = this.props.currentUser.id;

    let roundObject = {
      id: roundId,
      imageUrl,
      userId,
      datePlayed,
      roundType: roundType,
      golfCourseId: selectedCourse.id,
      roundComment,
      scoreCardType,
      totalStrokes,
      totalMinutes,
      totalSeconds,
      speedgolfScore,
      totalTime
    };

    if (scoreCardType === SCORE_CARD_TYPES.RECORD_EACH_HOLE) {
      roundObject["scores"] = scores;
      roundObject["selectedTeeSet"] = selectedTeeSet;
    }

    if (roundId) {
      // existing round, use update path
      await updateRound(roundObject).then(() => {
        this.props.dispatch(loadRounds());

        this.setState({
          isSubmitting: false
        });
        Alert.alert("Success!", "Round has been updated.", [
          {
            title: "Ok",
            onPress: Actions.rounds()
          }
        ]);
      });
    } else {
      // new round, use create path
      await createRound(roundObject).then(() => {
        this.props.dispatch(loadRounds());

        this.setState({
          isSubmitting: false
        });
        Alert.alert("Success!", "Round has been saved.", [
          {
            title: "Ok",
            onPress: Actions.rounds()
          }
        ]);
      });
    }
  };

  setRowTime = newTime => {
    let { selectedHoleIndex, scores } = this.state;
    let selectedHole = scores[selectedHoleIndex];
    let minutes = newTime[0];
    let seconds = newTime[1];
    let selectedHoleCopy = { ...selectedHole, minutes, seconds };
    let scoresCopy = { ...scores, [selectedHoleIndex]: selectedHoleCopy };
    this.setState({
      scores: scoresCopy
    });

    let totalTime = this.getTimeFromScorecard();
    this.setState({
      totalMinutes: totalTime[0],
      totalSeconds: totalTime[1]
    });
  };

  clearCourseSelection = () => {
    this.setState({
      selectedCourse: null,
      selectedTeeSet: null
    });
  };

  selectCourseAndSetTeeList = selectedCourseId => {
    let teeSetList = [];

    if (selectedCourseId) {
      let selectedCourse = this.props.golfCourseLookup[selectedCourseId];
      let teesForCourse = this.props.teeSetCourseLookup[selectedCourseId];
      if (teesForCourse) {
        Object.keys(teesForCourse).forEach(teeSetKey => {
          teeSetList.push(teeSetKey);
        });
      }
      this.setState({
        teeListData: teeSetList,
        selectedCourse
      });
    } else {
      console.warn("No tee sets listed for course. ");
    }
  };

  getCourseSection = () => {
    let { selectedCourse } = this.state;

    if (selectedCourse) {
      return (
        <CourseCard
          id={selectedCourse.id}
          imageUrl={selectedCourse.imageUrl}
          courseName={selectedCourse.courseName}
          propertyName={selectedCourse.propertyName}
          hideButtons={true}
          onClearCallback={this.clearCourseSelection}
        />
      );
    } else {
      return (
        <View>
          <CourseSelector
            styleOverride={{
              backgroundColor: COLORS.white
            }}
            onSelectCallback={courseId => {
              this.selectCourseAndSetTeeList(courseId);
            }}
            onClearCallback={this.clearCourseSelection}
          />
        </View>
      );
    }
  };

  toggleScoreCardType = () => {
    let newType =
      this.state.scoreCardType === SCORE_CARD_TYPES.RECORD_SUMMARY_ONLY
        ? SCORE_CARD_TYPES.RECORD_EACH_HOLE
        : SCORE_CARD_TYPES.RECORD_SUMMARY_ONLY;
    this.setState({
      scoreCardType: newType
    });
  };

  toggleAdditionalInfoModal = () => {
    Alert.alert(
      "More Info Coming Soon",
      "Starting in Version 2.0, you will be able to log weather, heart rate, exertion, and more!"
    );

    // this.setState({
    //   showAdditionalInfoModal: !this.state.showAdditionalInfoModal
    // });
  };

  getStrokesFromScorecard = () => {
    // should this really be a set?
    const { scores } = this.state;
    let totalStrokes = 0;

    for (let i = 1; i < 18; i++) {
      let scoreRow = scores[i];
      let strokes = parseInt(scoreRow.strokes);

      if (strokes) {
        totalStrokes += strokes;
      }
    }

    return totalStrokes;
  };

  getTimeFromScorecard = () => {
    const { scores } = this.state;
    let totalMinutes = 0;
    let totalSeconds = 0;

    for (let i = 1; i < 18; i++) {
      let scoreRow = scores[i];
      let { minutes, seconds } = scoreRow;

      if (minutes) {
        totalMinutes = parseInt(totalMinutes) + parseInt(minutes);
      }
      if (seconds) {
        totalSeconds = parseInt(totalSeconds) + parseInt(seconds);
      }

      if (parseInt(totalSeconds) >= 60) {
        let newSeconds = parseInt(totalSeconds) % 60;
        let additionalMinutes = (parseInt(totalSeconds) / 60).toFixed(0);

        totalMinutes = parseInt(
          parseInt(totalMinutes) + parseInt(additionalMinutes)
        ).toString(); // strips leading zeroes

        totalSeconds = newSeconds.toString();
      }

      if (totalSeconds.length === 1) {
        totalSeconds = `0${totalSeconds}`;
      }
    }

    return [totalMinutes, totalSeconds];
  };

  setStateValue = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  updateStrokes = (holeIndex, newStrokes) => {
    const { scores } = this.state;
    if (!holeIndex) {
      return;
    }

    let hole = scores[holeIndex];
    let holeCopy = { ...hole, strokes: newStrokes };
    let scoresCopy = { ...scores, [holeIndex]: holeCopy };

    this.setState({
      scores: scoresCopy
    });

    let newTotalStrokes = this.getStrokesFromScorecard();

    this.setState({
      totalStrokes: newTotalStrokes
    });
  };

  updateTime = (holeIndex, newTimeArray) => {
    const { scores } = this.state;
    if (!holeIndex) {
      return;
    }

    let hole = scores[holeIndex];
    let holeCopy = {
      ...hole,
      minutes: newTimeArray[0],
      seconds: newTimeArray[1]
    };
    let scoresCopy = { ...scores, [holeIndex]: holeCopy };

    this.setState({
      scores: scoresCopy
    });
    this.updateTotalTime(this.getTimeFromScorecard());
  };

  updateTotalStrokes = newValue => {
    this.setState({
      totalStrokes: newValue
    });
  };

  updateTotalTime = newTimeArray => {
    let newMinutes = newTimeArray[0];
    let newSeconds = newTimeArray[1];

    this.setState({
      totalMinutes: newMinutes,
      totalSeconds: newSeconds
    });
  };

  setPars = teeSetName => {
    let { selectedCourse, scores } = this.state;
    if (selectedCourse) {
      let teesForCourse = this.props.teeSetCourseLookup[selectedCourse.id];
      let actualTeeSet = teesForCourse[teeSetName];
      let holePars = actualTeeSet.holePars;
      let scoresCopy = {};

      Object.keys(scores).forEach(holeNumber => {
        let holeData = scores[holeNumber];
        let teeSetDataForHole = holePars[holeNumber];

        let newHoleData = {
          ...holeData,
          par: teeSetDataForHole.strokePar
        };

        scoresCopy[holeNumber] = newHoleData;
      });

      this.setState({
        scores: scoresCopy
      });
    }
  };

  selectTeeSet = teeSetName => {
    this.setState({
      selectedTeeSet: teeSetName
    });

    this.setPars(teeSetName);
  };

  buildTeeSelector = () => {
    return (
      <PressableInput
        label="Tee Set"
        value={this.state.selectedTeeSet}
        onPress={() => {
          if (this.state.teeListData && this.state.teeListData.length > 0) {
            this.launchPicker(
              this.state.teeListData,
              this.state.selectedTeeSet,
              "Selected Tee Set",
              data => this.selectTeeSet(data[0])
            );
          } else {
            Alert.alert(
              "No Tee Sets Defined",
              'You may add a tee set to the course in the "Suggest A Course" page, or just enter your overall score.'
            );
          }
        }}
        name="selectedTeeSet"
      />
    );
  };

  totalTimeReadOnly = () => {
    const { totalMinutes, totalSeconds } = this.state;

    let displayValue;

    if (parseInt(totalMinutes) > 0 || parseInt(totalSeconds) > 0) {
      displayValue = formatTimeMinutesSecondsOnly([totalMinutes, totalSeconds]);
    } else {
      displayValue = null;
    }

    return (
      <View style={{ maxWidth: 100 }}>
        <FormLabel labelStyle={STYLES.formLabel}>Time</FormLabel>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderBottomColor: "black",
            borderBottomWidth: 1,
            justifyContent: "center",
            alignContent: "center",
            height: 36,
            padding: 0,
            margin: 0
          }}
        >
          <TextInput
            value={displayValue}
            editable={false}
            style={{
              color: COLORS.blue,
              fontSize: 18,
              justifyContent: "center",
              alignContent: "center",
              flex: 1,
              padding: 0,
              margin: 0
            }}
            placeholder={"55:00"}
          />
        </View>
      </View>
    );
  };

  getScorecardSection = () => {
    const { scoreCardType, totalMinutes, totalSeconds } = this.state;
    if (scoreCardType === SCORE_CARD_TYPES.RECORD_EACH_HOLE) {
      let totalStrokes = this.getStrokesFromScorecard();
      let scorecardTime = this.getTimeFromScorecard();

      let timeColumnIsPristine = false;
      if (scorecardTime[0] === 0 && scorecardTime[1] === 0) {
        timeColumnIsPristine = true;
      }
      // if the scorecard time column is pristine time entry is still clickable and value is entered directly

      let displayTime = timeColumnIsPristine
        ? [totalMinutes, totalSeconds]
        : scorecardTime;

      let totalSpeegolfScore = [totalStrokes, ...displayTime];

      return (
        <View style={{ flexDirection: "column" }}>
          <View>
            {this.state.selectedCourse ? (
              this.buildTeeSelector()
            ) : (
              <View>
                <FormLabel labelStyle={STYLES.formLabel}>Tee Set</FormLabel>
                <Text>Please select a course before selecting a tee set.</Text>
                <Text>
                  Once a tee set is selected, the scorecard will appear.
                </Text>
                <Text>If no tee data exists, you may enter a new course.</Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              textAlign: "center",
              justifyContent: "space-around"
            }}
          >
            <PressableInput
              styleOverride={{
                maxWidth: 100
              }}
              onPress={() => {}}
              label="Score"
              editable={false}
              value={formatSpeedGolfScore(totalSpeegolfScore)}
              name="speedgolfScore"
              fontColor={COLORS.mediumGrey}
            />
            <PressableInput
              styleOverride={{
                maxWidth: 100
              }}
              onPress={() => {}}
              label="Strokes"
              value={totalStrokes}
              placeHolder={"72"}
              name="strokes"
              fontColor={COLORS.mediumGrey}
            />
            {this.totalTimeReadOnly()}
          </View>
          <ScoreCard
            updateStrokes={this.updateStrokes}
            updateTime={this.updateTime}
            scores={this.state.scores}
            advanceHole={this.advanceHole}
            advanceToTimeCell={this.advanceToTimeCell}
            setHole={holeIndex =>
              this.setState({
                selectedHoleIndex: holeIndex
              })
            }
            setRef={this.setRef}
          />
        </View>
      );
    } else {
      let { totalStrokes, totalMinutes, totalSeconds } = this.state;
      return (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            textAlign: "center",
            justifyContent: "space-around"
          }}
        >
          <PressableInput
            styleOverride={{
              maxWidth: 100
            }}
            onPress={() => {}}
            label="Score"
            editable={false}
            value={formatSpeedGolfScore([
              totalStrokes,
              totalMinutes,
              totalSeconds
            ])}
            name="speedgolfScore"
            fontColor={COLORS.mediumGrey}
          />
          <MyTextInput
            styleOverride={{
              maxWidth: 100
            }}
            keyboardType={"number-pad"}
            label="Strokes"
            value={totalStrokes}
            name="totalStrokes"
            onChange={(totalStrokes, newVal) => this.updateTotalStrokes(newVal)}
          />
          <View style={{ maxWidth: 100 }}>
            <FormLabel labelStyle={STYLES.formLabel}>Time</FormLabel>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderBottomColor: "black",
                borderBottomWidth: 1,
                justifyContent: "center",
                alignContent: "center",
                height: 36,
                padding: 0,
                margin: 0
              }}
            >
              <KeyboardTimeEntry
                minutes={totalMinutes}
                seconds={totalSeconds}
                onBlur={({ minutes, seconds }) =>
                  this.updateTotalTime([minutes, seconds])
                }
                onSubmitEditing={({ minutes, seconds }) => {
                  this.updateTotalTime([minutes, seconds]);
                  Keyboard.dismiss();
                }}
                style={{
                  color: COLORS.blue,
                  fontSize: 18,
                  justifyContent: "center",
                  alignContent: "center",
                  flex: 1,
                  padding: 0,
                  margin: 0
                }}
                placeholder={"55:00"}
              />
            </View>
          </View>
        </View>
      );
    }
  };

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

  checkDataAndInformUserOfIssues = () => {
    let { selectedCourse } = this.state;

    if (!selectedCourse) {
      Alert.alert("Please select a course to continue");

      return false;
    }

    return true;
  };

  render() {
    return (
      <View style={[STYLES.pageContainer, { backgroundColor: "white" }]}>
        {this.state.isSubmitting ? <LoadingOverlay /> : null}
        <View style={{ flex: 0, flexDirection: "row" }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showAdditionalInfoModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <AdditionalRoundInformation />
          </Modal>
          <KeyboardAwareScrollView
            extraScrollHeight={40}
            keyboardShouldPersistTaps="always"
          >
            <View
              style={{
                position: "relative"
              }}
            >
              <MyImagePicker
                title={"Round Photo (Optional, click to upload)"}
                subTitle={" "}
                icon={"picture-o"}
                imageSource={this.state.imageUrl}
                uploadCallback={imageUrl => {
                  this.setState({
                    imageUrl
                  });
                }}
              />
              <View
                style={{
                  paddingHorizontal: 10
                }}
              >
                <View
                  style={{
                    marginVertical: 10
                  }}
                >
                  <FormLabel labelStyle={STYLES.formLabel}>
                    Select Course
                  </FormLabel>
                  <View>{this.getCourseSection()}</View>
                </View>
                <PressableInput
                  onPress={() => {
                    this.launchPicker(
                      roundTypeOptions,
                      this.state.roundType,
                      "Type of Round",
                      data => {
                        this.setStateValue("roundType", data);
                      }
                    );
                  }}
                  label="Type of Round"
                  value={this.state.roundType}
                  name="roundType"
                />
                <PressableInput
                  onPress={() => {
                    this.launchPicker(
                      dateData,
                      this.state.datePlayed,
                      "Date Played",
                      data => {
                        this.setStateValue("datePlayed", data);
                      }
                    );
                  }}
                  label={"Date Played"}
                  value={formatDate(this.state.datePlayed)}
                  name={"datePlayed"}
                />
                <FormLabel labelStyle={STYLES.formLabel}>
                  Scorecard Entry Type
                </FormLabel>
                <ButtonGroup
                  containerStyle={{
                    width: "100%",
                    position: "relative",
                    left: -10
                  }}
                  selectedIndex={this.state.scoreCardType}
                  onPress={this.toggleScoreCardType}
                  buttons={["ROUND SUMMARY", "HOLE-BY-HOLE"]}
                  selectedButtonStyle={{ backgroundColor: COLORS.blue }}
                  selectedTextStyle={{
                    color: COLORS.lightGrey,
                    fontWeight: "bold"
                  }}
                />
                {this.getScorecardSection()}
                <View
                  style={{
                    marginVertical: 20
                  }}
                >
                  <FormLabel labelStyle={STYLES.formLabel}>
                    Round Comments
                  </FormLabel>
                  <TextInput
                    autoCorrect={false}
                    multiline={true}
                    textAlignVertical={"top"}
                    style={{
                      borderColor: COLORS.lightGrey,
                      borderWidth: 1,
                      height: 150,
                      padding: 10
                    }}
                    value={this.state.roundComment}
                    placeholder={"Round Comments"}
                    onChangeText={newText => {
                      this.setState({
                        roundComment: newText
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Button
                buttonStyle={{
                  minWidth: 140
                }}
                backgroundColor={COLORS.blue}
                title="Enter More Info"
                onPress={this.toggleAdditionalInfoModal}
                disabled={false}
              />

              <Button
                buttonStyle={{
                  minWidth: 140
                }}
                backgroundColor={COLORS.blue}
                title={this.state.roundId ? "Update Round" : "Save Round"}
                onPress={this.submitRound}
                disabled={this.state.isSubmitting}
                loading={this.state.isSubmitting}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    teeSetCourseLookup: state.teeSetCourseLookup,
    golfCourseLookup: state.golfCourseLookup,
    roundLookup: state.roundLookup,
    roundId: state.currentRoundId
  };
};

LogRound = connect(mapStateToProps)(LogRound);
